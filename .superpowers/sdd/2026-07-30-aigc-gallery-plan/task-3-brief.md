# Task 3: Content Loader (Core Engine)

## Objective

Implement `src/lib/content.ts` — the content loader that scans `public/media/` for raw media files and `content/works/` for .mdx metadata files, merges them with dual-layer logic, validates with Zod, and produces a typed `WorksIndex`.

Four exported functions: `getAllWorks`, `getWork`, `getWorksByType`, `getFeaturedWorks`.

## Dual-Layer Merge Logic

- **Layer 1 (media scan)**: Scan `public/media/{images,videos,audio,text}/` for raw files. Each file becomes a candidate bare entry.
- **Layer 2 (metadata scan)**: Scan `content/works/*.mdx` for frontmatter. Parse with `gray-matter`, validate with `workEntrySchema`, set `isBare: false`.
- **Merge**: For each .mdx file, the slug is the filename minus `.mdx`. If a media file has the same slug, the .mdx metadata enriches it. If only a media file exists without .mdx, create a bare entry (`isBare: true`) with defaults (title = slug, date = '', featured = false, model = null, prompt = null, tags = []).
- **Caching**: Module-level cache. A cache-busting `invalidateCache()` is exported for testing.

## Media Directory Mapping

| `public/media/` subdir | `WorkType` |
|---|---|
| `images/` | `image` |
| `videos/` | `video` |
| `audio/` | `audio` |
| `text/` | `text` |

## API Surface

```typescript
function getAllWorks(): WorksIndex
function getWork(slug: string): WorkEntry | undefined
function getWorksByType(type: WorkType): WorksIndex
function getFeaturedWorks(): WorksIndex
function invalidateCache(): void
```

## Reference Implementation (`src/lib/content.ts`)

```typescript
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
        files.push({ slug, type: workType, src: `/media/${dirName}/${entry.name}` })
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
    const parsed = workEntrySchema.safeParse({ ...data, slug })
    if (parsed.success) {
      works.push({ ...parsed.data, isBare: false })
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
  if (cache === null) cache = buildWorksIndex()
  return cache
}

export function invalidateCache(): void { cache = null }

export function getAllWorks(): WorksIndex { return [...getIndex()] }

export function getWork(slug: string): WorkEntry | undefined {
  return getIndex().find(w => w.slug === slug)
}

export function getWorksByType(type: WorkType): WorksIndex {
  return getIndex().filter(w => w.type === type)
}

export function getFeaturedWorks(): WorksIndex {
  return getIndex().filter(w => w.featured)
}
```

## Tests (`src/lib/content.test.ts`)

```typescript
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  getAllWorks,
  getWork,
  getWorksByType,
  getFeaturedWorks,
  invalidateCache,
} from './content'
import type { WorkEntry } from './types'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
const CONTENT_DIR = path.join(process.cwd(), 'content', 'works')

// Helper to write a temp media file
function writeMedia(subdir: string, filename: string, content = ''): void {
  const dir = path.join(MEDIA_DIR, subdir)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, filename), content, 'utf-8')
}

// Helper to write a temp .mdx file
function writeMdx(slug: string, frontmatter: Record<string, unknown>): void {
  fs.mkdirSync(CONTENT_DIR, { recursive: true })
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => {
      if (v === undefined || v === null) return `${k}:`
      if (typeof v === 'boolean') return `${k}: ${v}`
      if (Array.isArray(v)) return `${k}:\n${v.map(i => `  - ${i}`).join('\n')}`
      return `${k}: ${v}`
    })
    .join('\n')
  fs.writeFileSync(
    path.join(CONTENT_DIR, `${slug}.mdx`),
    `---\n${yaml}\n---\n\n# ${frontmatter.title || slug}\n`,
    'utf-8',
  )
}

function cleanTestFiles(createdMedia: string[], createdMdx: string[]): void {
  for (const p of createdMdx) {
    const fp = path.join(CONTENT_DIR, p)
    if (fs.existsSync(fp)) fs.unlinkSync(fp)
  }
  for (const p of createdMedia) {
    const fp = path.join(MEDIA_DIR, p)
    if (fs.existsSync(fp)) fs.unlinkSync(fp)
  }
}

const createdMedia: string[] = []
const createdMdx: string[] = []

const validMdxFrontmatter = {
  title: 'Sunset Overdrive',
  type: 'image',
  date: '2026-07-15',
  src: '/media/images/sunset.png',
  thumbnail: '/media/thumbnails/sunset.webp',
  model: 'Midjourney v6.1',
  prompt: 'A vibrant sunset over a cyberpunk city',
  featured: true,
  tags: ['cyberpunk', 'sunset'],
}

// --- Clean up ALL test artifacts after suite ---
afterAll(() => {
  cleanTestFiles(createdMedia, createdMdx)
})

// --- Reset cache before each test ---
beforeEach(() => {
  invalidateCache()
  cleanTestFiles(createdMedia, createdMdx)
  createdMedia.length = 0
  createdMdx.length = 0
})

describe('content loader', () => {
  it('returns an empty index when no files exist', () => {
    const works = getAllWorks()
    expect(works).toEqual([])
  })

  it('creates bare entries for media files without .mdx metadata', () => {
    writeMedia('images', 'bare-sunset.png')
    createdMedia.push('images/bare-sunset.png')

    const works = getAllWorks()
    expect(works).toHaveLength(1)
    expect(works[0]).toMatchObject({
      slug: 'bare-sunset',
      title: 'bare-sunset',
      type: 'image',
      src: '/media/images/bare-sunset.png',
      isBare: true,
    })
  })

  it('loads full entries from .mdx frontmatter', () => {
    writeMdx('sunset-overdrive', validMdxFrontmatter)
    writeMedia('images', 'sunset.png')
    createdMdx.push('sunset-overdrive.mdx')
    createdMedia.push('images/sunset.png')

    const work = getWork('sunset-overdrive')
    expect(work).toBeDefined()
    expect(work!.title).toBe('Sunset Overdrive')
    expect(work!.type).toBe('image')
    expect(work!.isBare).toBe(false)
    expect(work!.featured).toBe(true)
    expect(work!.tags).toEqual(['cyberpunk', 'sunset'])
  })

  it('prefers .mdx metadata over bare media entry for same slug', () => {
    // .mdx with slug 'ocean' points to a different src
    writeMdx('ocean', {
      title: 'Deep Ocean',
      type: 'image',
      date: '2026-06-01',
      src: '/media/images/ocean-wave.jpg',
      thumbnail: '/media/thumbnails/ocean.webp',
      model: 'DALL-E 3',
      prompt: 'Deep blue ocean waves',
    })
    // Also a raw file images/ocean.png with same slug
    writeMedia('images', 'ocean.png')
    createdMdx.push('ocean.mdx')
    createdMedia.push('images/ocean.png')

    const works = getAllWorks()
    const ocean = works.find(w => w.slug === 'ocean')
    expect(ocean).toBeDefined()
    expect(ocean!.isBare).toBe(false)
    // .mdx src takes precedence
    expect(ocean!.src).toBe('/media/images/ocean-wave.jpg')
    expect(ocean!.title).toBe('Deep Ocean')
  })

  it('getAllWorks returns all entries (bare + metadata)', () => {
    writeMedia('images', 'photo-a.png')
    writeMedia('images', 'photo-b.png')
    writeMdx('photo-a', {
      title: 'Photo A',
      type: 'image',
      date: '2026-01-01',
      src: '/media/images/photo-a.png',
      thumbnail: '/media/thumbnails/photo-a.webp',
      model: 'SDXL',
      prompt: 'A photo',
    })
    createdMedia.push('images/photo-a.png', 'images/photo-b.png')
    createdMdx.push('photo-a.mdx')

    const works = getAllWorks()
    expect(works).toHaveLength(2)
    const a = works.find(w => w.slug === 'photo-a')
    const b = works.find(w => w.slug === 'photo-b')
    expect(a!.isBare).toBe(false)
    expect(b!.isBare).toBe(true)
  })

  it('getWork returns undefined for unknown slug', () => {
    const result = getWork('nonexistent')
    expect(result).toBeUndefined()
  })

  it('getWorksByType filters correctly', () => {
    writeMedia('images', 'img1.png')
    writeMedia('videos', 'vid1.mp4')
    writeMedia('audio', 'aud1.mp3')
    writeMedia('text', 'txt1.txt')
    createdMedia.push(
      'images/img1.png',
      'videos/vid1.mp4',
      'audio/aud1.mp3',
      'text/txt1.txt',
    )

    const images = getWorksByType('image')
    const videos = getWorksByType('video')
    const audio = getWorksByType('audio')
    const text = getWorksByType('text')

    expect(images).toHaveLength(1)
    expect(images[0].slug).toBe('img1')
    expect(videos).toHaveLength(1)
    expect(videos[0].slug).toBe('vid1')
    expect(audio).toHaveLength(1)
    expect(audio[0].slug).toBe('aud1')
    expect(text).toHaveLength(1)
    expect(text[0].slug).toBe('txt1')
  })

  it('getFeaturedWorks returns only featured entries', () => {
    writeMdx('featured-one', { ...validMdxFrontmatter, slug: 'featured-one', featured: true, src: '/media/images/f1.png', thumbnail: '/media/thumbnails/f1.webp' })
    writeMdx('not-featured', { ...validMdxFrontmatter, slug: 'not-featured', featured: false, src: '/media/images/nf.png', thumbnail: '/media/thumbnails/nf.webp', title: 'Not Featured' })
    writeMedia('images', 'f1.png')
    writeMedia('images', 'nf.png')
    createdMdx.push('featured-one.mdx', 'not-featured.mdx')
    createdMedia.push('images/f1.png', 'images/nf.png')

    const featured = getFeaturedWorks()
    expect(featured).toHaveLength(1)
    expect(featured[0].slug).toBe('featured-one')
    expect(featured[0].featured).toBe(true)
  })

  it('handles different media types in correct subdirs', () => {
    writeMedia('images', 'landscape.jpg')
    writeMedia('videos', 'drone.mp4')
    writeMedia('audio', 'ambient.wav')
    writeMedia('text', 'essay.md')
    createdMedia.push(
      'images/landscape.jpg',
      'videos/drone.mp4',
      'audio/ambient.wav',
      'text/essay.md',
    )

    const works = getAllWorks()
    expect(works).toHaveLength(4)

    const landscape = getWork('landscape')
    expect(landscape!.type).toBe('image')
    expect(landscape!.src).toBe('/media/images/landscape.jpg')

    const drone = getWork('drone')
    expect(drone!.type).toBe('video')
    expect(drone!.src).toBe('/media/videos/drone.mp4')

    const ambient = getWork('ambient')
    expect(ambient!.type).toBe('audio')
    expect(ambient!.src).toBe('/media/audio/ambient.wav')

    const essay = getWork('essay')
    expect(essay!.type).toBe('text')
    expect(essay!.src).toBe('/media/text/essay.md')
  })
})
```

## Edge Cases

- **Empty directories** → empty `WorksIndex`
- **No `.mdx` files** → all bare entries from media scan
- **Invalid frontmatter in `.mdx`** → entry silently skipped (safeParse failure)
- **Same slug in media + mdx** → .mdx wins (isBare=false, title/src from mdx)
- **Cache** → module-level cache; `invalidateCache()` clears it
- **Cleanup** → `afterAll` removes all test files from `public/media/` and `content/works/`
