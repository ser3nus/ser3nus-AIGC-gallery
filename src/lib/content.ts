import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { workEntrySchema } from './schema'
import type { WorkEntry, WorksIndex, WorkType } from './types'

/** Sanitize a filename stem into a URL-safe slug */
function slugify(name: string): string {
  return name
    .normalize('NFC')
    .replace(/[^a-zA-Z0-9一-鿿㐀-䶿-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
const CONTENT_DIR = path.join(process.cwd(), 'content', 'works')

const MEDIA_EXTENSIONS: Record<string, string[]> = {
  images: ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg'],
  videos: ['.mp4', '.webm', '.mov'],
  audio: ['.mp3', '.wav', '.ogg', '.flac'],
  text: ['.md', '.txt'],
}

const SCAN_DIRS = ['images', 'videos', 'audio', 'text'] as const
type ScanDir = typeof SCAN_DIRS[number]

function dirToType(dir: ScanDir): WorkType {
  const map: Record<ScanDir, WorkType> = { images: 'image', videos: 'video', audio: 'audio', text: 'text' }
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

      const slug = path.basename(entry.name, ext).normalize('NFC')
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

      const slug = path.basename(entry.name, '.mdx').normalize('NFC')
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

function buildWorksIndex(): WorksIndex {
  const mediaFiles = scanMediaFiles()
  const mdxWorks = scanMdxFiles()
  const mdxSlugs = new Set(mdxWorks.map(w => w.slug))
  const index: WorksIndex = [...mdxWorks]

  for (const mediaFile of mediaFiles) {
    if (!mdxSlugs.has(mediaFile.slug)) {
      index.push({
        slug: mediaFile.slug,
        title: mediaFile.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        type: mediaFile.type,
        date: new Date().toISOString().split('T')[0],
        src: mediaFile.src,
        model: null,
        prompt: null,
        featured: false,
        tags: [],
        isBare: true,
      })
    }
  }

  // Check featured works have valid files
  for (const w of index.filter(w => w.featured)) {
    const filePath = path.join(process.cwd(), 'public', w.src)
    if (!fs.existsSync(filePath)) {
      throw new Error(`[content] Featured work "${w.slug}" has missing src: ${w.src}`)
    }
  }

  // Check for duplicate slugs
  const slugs = new Set<string>()
  for (const w of index) {
    if (slugs.has(w.slug)) throw new Error(`[content] Duplicate slug: "${w.slug}"`)
    slugs.add(w.slug)
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
  const normalized = slug.normalize('NFC')
  return getIndex().find(w => w.slug === normalized) ?? null
}

export function getWorksByType(type: WorkType): WorkEntry[] {
  return getIndex().filter(w => w.type === type)
}

export function getFeaturedWorks(): WorkEntry[] {
  return getIndex().filter(w => w.featured)
}
