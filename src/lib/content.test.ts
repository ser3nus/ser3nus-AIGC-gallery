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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function writeMedia(subdir: string, filename: string, content = ''): void {
  const dir = path.join(MEDIA_DIR, subdir)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, filename), content, 'utf-8')
}

function writeMdx(slug: string, frontmatter: Record<string, unknown>): void {
  fs.mkdirSync(CONTENT_DIR, { recursive: true })
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => {
      if (v === undefined || v === null) return `${k}:`
      if (typeof v === 'boolean') return `${k}: ${v}`
      if (typeof v === 'number') return `${k}: ${v}`
      if (Array.isArray(v)) {
        return `${k}:\n${v.map((i: unknown) => `  - ${i}`).join('\n')}`
      }
      // Quote strings to prevent YAML type coercion (e.g. dates)
      return `${k}: "${v}"`
    })
    .join('\n')
  fs.writeFileSync(
    path.join(CONTENT_DIR, `${slug}.mdx`),
    `---\n${yaml}\n---\n\n# ${frontmatter.title ?? slug}\n`,
    'utf-8',
  )
}

function cleanTestFiles(mediaPaths: string[], mdxPaths: string[]): void {
  for (const p of mdxPaths) {
    const fp = path.join(CONTENT_DIR, p)
    try { fs.unlinkSync(fp) } catch { /* ignore */ }
  }
  for (const p of mediaPaths) {
    const fp = path.join(MEDIA_DIR, p)
    try { fs.unlinkSync(fp) } catch { /* ignore */ }
  }
}

/** Aggressively remove all non-.gitkeep files from media + content works dirs */
function cleanAllFiles(): void {
  for (const subdir of ['images', 'videos', 'audio', 'text']) {
    const mediaSub = path.join(MEDIA_DIR, subdir)
    if (fs.existsSync(mediaSub)) {
      for (const f of fs.readdirSync(mediaSub)) {
        if (f === '.gitkeep') continue
        try { fs.unlinkSync(path.join(mediaSub, f)) } catch { /* ignore */ }
      }
    }
    const contentSub = path.join(CONTENT_DIR, subdir)
    if (fs.existsSync(contentSub)) {
      for (const f of fs.readdirSync(contentSub)) {
        if (f === '.gitkeep') continue
        try { fs.unlinkSync(path.join(contentSub, f)) } catch { /* ignore */ }
      }
    }
  }
  // Also clean flat .mdx files in CONTENT_DIR root
  if (fs.existsSync(CONTENT_DIR)) {
    for (const f of fs.readdirSync(CONTENT_DIR)) {
      if (f === '.gitkeep' || fs.statSync(path.join(CONTENT_DIR, f)).isDirectory()) continue
      try { fs.unlinkSync(path.join(CONTENT_DIR, f)) } catch { /* ignore */ }
    }
  }
}

// ---------------------------------------------------------------------------
// Shared state for cleanup
// ---------------------------------------------------------------------------

const createdMedia: string[] = []
const createdMdx: string[] = []

const validMdxFrontmatter: Record<string, unknown> = {
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

// ---------------------------------------------------------------------------
// Cleanup once at the very end (safety net for any leftovers)
// ---------------------------------------------------------------------------

afterAll(() => {
  cleanTestFiles(createdMedia, createdMdx)
})

// ---------------------------------------------------------------------------
// Reset before each test
// ---------------------------------------------------------------------------

beforeEach(() => {
  invalidateCache()
  cleanAllFiles()
  cleanTestFiles(createdMedia, createdMdx)
  createdMedia.length = 0
  createdMdx.length = 0
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

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
    writeMdx('ocean', {
      title: 'Deep Ocean',
      type: 'image',
      date: '2026-06-01',
      src: '/media/images/ocean-wave.jpg',
      thumbnail: '/media/thumbnails/ocean.webp',
      model: 'DALL-E 3',
      prompt: 'Deep blue ocean waves',
    } satisfies Record<string, unknown>)
    writeMedia('images', 'ocean.png')
    createdMdx.push('ocean.mdx')
    createdMedia.push('images/ocean.png')

    const works = getAllWorks()
    const ocean = works.find(w => w.slug === 'ocean')
    expect(ocean).toBeDefined()
    expect(ocean!.isBare).toBe(false)
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
    } satisfies Record<string, unknown>)
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
    writeMdx('featured-one', {
      ...validMdxFrontmatter,
      slug: 'featured-one',
      featured: true,
      src: '/media/images/f1.png',
      thumbnail: '/media/thumbnails/f1.webp',
    })
    writeMdx('not-featured', {
      ...validMdxFrontmatter,
      slug: 'not-featured',
      featured: false,
      src: '/media/images/nf.png',
      thumbnail: '/media/thumbnails/nf.webp',
      title: 'Not Featured',
    })
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
