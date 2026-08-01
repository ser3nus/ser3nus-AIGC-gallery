import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { workEntrySchema } from './schema'
import type { WorkEntry, WorksIndex, WorkType } from './types'

/** Hash a string into a short hex digest (simple djb2) */
function hashStr(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(16).padStart(8, '0')
}

/** Sanitize a filename stem into a URL-safe ASCII slug.
 *  Non-ASCII names get a short hash suffix for uniqueness. */
function slugify(name: string): string {
  const ascii = name.normalize('NFC').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()
  if (ascii.length > 0 && /[a-z0-9]/.test(ascii)) return ascii
  // Purely non-ASCII: use hash
  return 'work-' + hashStr(name)
}

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
const CONTENT_DIR = path.join(process.cwd(), 'content', 'works')

const IMG_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg']

const MEDIA_EXTENSIONS: Record<string, string[]> = {
  images: IMG_EXTS,
  videos: ['.mp4', '.webm', '.mov'],
  audio: ['.mp3', '.wav', '.ogg', '.flac'],
  text: ['.md', '.txt'],
  banner: IMG_EXTS,
  background: IMG_EXTS,
}

const SCAN_DIRS = ['images', 'videos', 'audio', 'text', 'banner', 'background'] as const
type ScanDir = typeof SCAN_DIRS[number]

function dirToType(dir: ScanDir): WorkType {
  const map: Record<ScanDir, WorkType> = { images: 'image', videos: 'video', audio: 'audio', text: 'text', banner: 'image', background: 'image' }
  return map[dir]
}

interface RawMediaFile { slug: string; type: WorkType; src: string }

function scanMediaFiles(): RawMediaFile[] {
  if (!fs.existsSync(MEDIA_DIR)) return []
  const files: RawMediaFile[] = []

  for (const dir of SCAN_DIRS) {
    const dirPath = path.join(MEDIA_DIR, dir)
    if (!fs.existsSync(dirPath)) continue

    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (!entry.isFile()) continue
      if (entry.name.startsWith('.')) continue
      const ext = path.extname(entry.name).toLowerCase()
      if (!(MEDIA_EXTENSIONS[dir] || []).includes(ext)) continue

      const slug = slugify(path.basename(entry.name, ext))
      files.push({ slug, type: dirToType(dir), src: `/media/${dir}/${entry.name}` })
    }
  }
  return files
}

function scanMdxFiles(): WorkEntry[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const works: WorkEntry[] = []

  for (const dir of SCAN_DIRS) {
    const dirPath = path.join(CONTENT_DIR, dir)
    if (!fs.existsSync(dirPath)) continue

    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue
      if (entry.name.startsWith('.')) continue

      const slug = slugify(path.basename(entry.name, '.mdx'))
      const fullPath = path.join(dirPath, entry.name)
      const raw = fs.readFileSync(fullPath, 'utf-8')
      const { data, content } = matter(raw)

      // YAML parses date-like strings as Date objects; convert back to string
      const cleaned: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        cleaned[key] = value instanceof Date ? value.toISOString().split('T')[0] : value
      }
      const parsed = workEntrySchema.safeParse({ ...cleaned, slug })

      if (parsed.success) {
        works.push({
          ...parsed.data,
          description: content?.trim() || undefined,
          isBare: false,
        })
      } else {
        console.error(`[content] Invalid frontmatter in ${fullPath}:`, parsed.error.issues)
      }
    }
  }
  return works
}

// Priority order for dedup: images > banner > background > videos > audio > text
const DIR_PRIORITY: Record<string, number> = {
  images: 1, banner: 2, background: 3, videos: 4, audio: 5, text: 6,
}

function buildWorksIndex(): WorksIndex {
  const mediaFiles = scanMediaFiles()
  const mdxWorks = scanMdxFiles()

  // Map slug → best media file (highest priority dir)
  const mediaBySlug = new Map<string, RawMediaFile>()
  for (const m of mediaFiles) {
    const existing = mediaBySlug.get(m.slug)
    if (!existing) { mediaBySlug.set(m.slug, m); continue }
    const curDir = m.src.split('/')[2] // /media/{dir}/file
    const existDir = existing.src.split('/')[2]
    if ((DIR_PRIORITY[curDir] ?? 99) < (DIR_PRIORITY[existDir] ?? 99)) {
      mediaBySlug.set(m.slug, m)
    }
  }

  const index: WorksIndex = []
  const usedSlugs = new Set<string>()

  // MDX works first; fix src if file missing but media exists elsewhere
  for (const mdx of mdxWorks) {
    const srcPath = path.join(process.cwd(), 'public', mdx.src)
    if (!fs.existsSync(srcPath)) {
      const alt = mediaBySlug.get(mdx.slug)
      if (alt) {
        mdx.src = alt.src
        if (!mdx.thumbnail) mdx.thumbnail = alt.src
      } else if (mdx.featured) {
        throw new Error(`[content] Featured work "${mdx.slug}" has missing src: ${mdx.src}`)
      }
    }
    index.push(mdx)
    usedSlugs.add(mdx.slug)
  }

  // Add remaining bare entries, deduped
  for (const [, media] of mediaBySlug) {
    if (usedSlugs.has(media.slug)) continue
    index.push({
      slug: media.slug,
      title: media.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      type: media.type,
      date: new Date().toISOString().split('T')[0],
      src: media.src,
      model: null,
      prompt: null,
      featured: false,
      tags: [],
      isBare: true,
    })
    usedSlugs.add(media.slug)
  }

  // Check featured works have valid files
  for (const w of index.filter(w => w.featured)) {
    const filePath = path.join(process.cwd(), 'public', w.src)
    if (!fs.existsSync(filePath)) {
      throw new Error(`[content] Featured work "${w.slug}" has missing src: ${w.src}`)
    }
  }

  index.sort((a, b) => b.date.localeCompare(a.date))
  return index
}

let cache: WorksIndex | null = null
let cacheTime = 0
const CACHE_TTL = 5000 // 5 seconds — fresh enough for dev, consistent within a request

export function invalidateCache(): void { cache = null; cacheTime = 0 }

function getIndex(): WorksIndex {
  const now = Date.now()
  if (cache && (now - cacheTime) < CACHE_TTL) return cache
  cache = buildWorksIndex()
  cacheTime = now
  return cache
}

export function getAllWorks(): WorkEntry[] {
  return [...getIndex()]
}

export function getWork(slug: string): WorkEntry | null {
  const key = slugify(slug)
  return getIndex().find(w => w.slug === key) ?? null
}

export function getWorksByType(type: WorkType): WorkEntry[] {
  return getIndex().filter(w => w.type === type)
}

export function getFeaturedWorks(): WorkEntry[] {
  return getIndex().filter(w => w.featured)
}

/** Works in public/media/banner/ — appear in homepage carousel */
export function getBannerWorks(): WorkEntry[] {
  return getIndex().filter(w => w.src.startsWith('/media/banner/'))
}
