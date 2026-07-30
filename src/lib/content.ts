import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { workEntrySchema } from './schema'
import type { WorkEntry, WorksIndex, WorkType } from './types'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
const CONTENT_DIR = path.join(process.cwd(), 'content', 'works')

type MediaTypeDir = { dirName: string; workType: WorkType }

const MEDIA_DIRS: MediaTypeDir[] = [
  { dirName: 'images', workType: 'image' },
  { dirName: 'videos', workType: 'video' },
  { dirName: 'audio', workType: 'audio' },
  { dirName: 'text', workType: 'text' },
]

interface RawMediaFile {
  slug: string
  type: WorkType
  src: string
}

function scanMediaFiles(): RawMediaFile[] {
  if (!fs.existsSync(MEDIA_DIR)) return []

  const files: RawMediaFile[] = []

  for (const { dirName, workType } of MEDIA_DIRS) {
    const dirPath = path.join(MEDIA_DIR, dirName)
    if (!fs.existsSync(dirPath)) continue

    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name)
        const slug = path.basename(entry.name, ext)
        files.push({
          slug,
          type: workType,
          src: `/media/${dirName}/${entry.name}`,
        })
      }
    }
  }

  return files
}

function scanMdxFiles(): WorkEntry[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const works: WorkEntry[] = []
  const mdxFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'))

  for (const mdxFile of mdxFiles) {
    const slug = path.basename(mdxFile, '.mdx')
    const fullPath = path.join(CONTENT_DIR, mdxFile)
    const raw = fs.readFileSync(fullPath, 'utf-8')

    const { data } = matter(raw)
    // YAML parses values like "2026-07-15" as Date objects.
    // Convert any Date instances to ISO date strings so Zod's
    // z.string() validation does not reject them.
    const cleaned: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      cleaned[key] = value instanceof Date ? value.toISOString().split('T')[0] : value
    }
    const parsed = workEntrySchema.safeParse({ ...cleaned, slug })

    if (parsed.success) {
      works.push({
        ...parsed.data,
        isBare: false,
      })
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
        title: mediaFile.slug,
        type: mediaFile.type,
        date: '',
        src: mediaFile.src,
        model: null,
        prompt: null,
        featured: false,
        tags: [],
        isBare: true,
      })
    }
  }

  return index
}

let cache: WorksIndex | null = null

function getIndex(): WorksIndex {
  if (cache === null) {
    cache = buildWorksIndex()
  }
  return cache
}

export function invalidateCache(): void {
  cache = null
}

export function getAllWorks(): WorksIndex {
  return [...getIndex()]
}

export function getWork(slug: string): WorkEntry | undefined {
  return getIndex().find(w => w.slug === slug)
}

export function getWorksByType(type: WorkType): WorksIndex {
  return getIndex().filter(w => w.type === type)
}

export function getFeaturedWorks(): WorksIndex {
  return getIndex().filter(w => w.featured)
}
