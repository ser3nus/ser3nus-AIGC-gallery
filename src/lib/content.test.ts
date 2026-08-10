import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  getAllWorks,
  getWork,
  getWorksByType,
  getFeaturedWorks,
  getCategories,
  invalidateCache,
} from './content'
import type { WorkEntry } from './types'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
const CONTENT_DIR = path.join(process.cwd(), 'content', 'works')

// Helpers
function writeMedia(subdir: string, filename: string, content = ''): void {
  const dir = path.join(MEDIA_DIR, subdir)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, filename), content, 'utf-8')
}

function writeMdx(subdir: string, slug: string, frontmatter: Record<string, unknown>): void {
  const dir = path.join(CONTENT_DIR, subdir)
  fs.mkdirSync(dir, { recursive: true })
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => {
      if (v === undefined || v === null) return `${k}:`
      if (typeof v === 'boolean') return `${k}: ${v}`
      if (typeof v === 'number') return `${k}: ${v}`
      if (Array.isArray(v)) return `${k}:\n${v.map((i: unknown) => `  - ${i}`).join('\n')}`
      return `${k}: "${v}"`
    })
    .join('\n')
  fs.writeFileSync(
    path.join(dir, `${slug}.mdx`),
    `---\n${yaml}\n---\n\n# ${frontmatter.title ?? slug}\n`,
    'utf-8',
  )
}

// Track test-created files
const createdMedia: string[] = []
const createdMdx: string[] = []

function cleanTestFiles(): void {
  for (const p of createdMdx) {
    // p is like 'images/slug.mdx' or just 'slug.mdx'
    for (const subdir of ['images', 'videos', 'audio', 'text']) {
      try { fs.unlinkSync(path.join(CONTENT_DIR, subdir, path.basename(p))) } catch { /* */ }
    }
  }
  for (const p of createdMedia) {
    try { fs.unlinkSync(path.join(MEDIA_DIR, p)) } catch { /* */ }
  }
}

/** Check if entry with given slug is test-created */
function isTestSlug(slug: string): boolean {
  return createdMdx.some(p => p.includes(slug)) || createdMedia.some(p => p.includes(slug))
}

/** Filter works to only test-created ones */
function testOnly(works: WorkEntry[]): WorkEntry[] {
  return works.filter(w => isTestSlug(w.slug))
}

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

afterAll(() => cleanTestFiles())

beforeEach(() => {
  invalidateCache()
  cleanTestFiles()
  createdMedia.length = 0
  createdMdx.length = 0
})

describe('content loader', () => {
  it('returns an array of works (including any real content)', () => {
    const works = getAllWorks()
    expect(Array.isArray(works)).toBe(true)
    expect(works.length).toBeGreaterThanOrEqual(0)
  })

  it('creates bare entries for media files without .mdx metadata', () => {
    writeMedia('images', 'bare-sunset.png')
    createdMedia.push('images/bare-sunset.png')

    const works = testOnly(getAllWorks())
    expect(works).toHaveLength(1)
    expect(works[0]).toMatchObject({
      slug: 'bare-sunset',
      type: 'image',
      src: '/media/images/bare-sunset.png',
      isBare: true,
    })
  })

  it('loads full entries from .mdx frontmatter', () => {
    writeMdx('images', 'sunset-overdrive', validMdxFrontmatter)
    writeMedia('images', 'sunset.png')
    createdMdx.push('images/sunset-overdrive.mdx')
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
    writeMdx('images', 'ocean', {
      title: 'Deep Ocean',
      type: 'image',
      date: '2026-06-01',
      src: '/media/images/ocean-wave.jpg',
      thumbnail: '/media/thumbnails/ocean.webp',
      model: 'DALL-E 3',
      prompt: 'Deep blue ocean waves',
    })
    writeMedia('images', 'ocean.png')
    createdMdx.push('images/ocean.mdx')
    createdMedia.push('images/ocean.png')

    const ocean = getWork('ocean')
    expect(ocean).toBeDefined()
    expect(ocean!.isBare).toBe(false)
    // Dedup corrects src to actual file
    expect(ocean!.src).toBe('/media/images/ocean.png')
    expect(ocean!.title).toBe('Deep Ocean')
  })

  it('getAllWorks returns all test entries (bare + metadata)', () => {
    writeMedia('images', 'photo-a.png')
    writeMedia('images', 'photo-b.png')
    writeMdx('images', 'photo-a', {
      title: 'Photo A',
      type: 'image',
      date: '2026-01-01',
      src: '/media/images/photo-a.png',
      thumbnail: '/media/thumbnails/photo-a.webp',
      model: 'SDXL',
      prompt: 'A photo',
    })
    createdMedia.push('images/photo-a.png', 'images/photo-b.png')
    createdMdx.push('images/photo-a.mdx')

    const works = testOnly(getAllWorks())
    expect(works).toHaveLength(2)
    const a = works.find(w => w.slug === 'photo-a')
    const b = works.find(w => w.slug === 'photo-b')
    expect(a!.isBare).toBe(false)
    expect(b!.isBare).toBe(true)
  })

  it('getWork returns null for unknown slug', () => {
    expect(getWork('nonexistent')).toBeNull()
  })

  it('getWorksByType filters correctly (test entries only)', () => {
    writeMedia('images', 'img1.png')
    writeMedia('videos', 'vid1.mp4')
    writeMedia('audio', 'aud1.mp3')
    writeMedia('text', 'txt1.txt')
    createdMedia.push('images/img1.png', 'videos/vid1.mp4', 'audio/aud1.mp3', 'text/txt1.txt')

    expect(testOnly(getWorksByType('image'))).toHaveLength(1)
    expect(testOnly(getWorksByType('video'))).toHaveLength(1)
    expect(testOnly(getWorksByType('audio'))).toHaveLength(1)
    expect(testOnly(getWorksByType('text'))).toHaveLength(1)
  })

  it('getFeaturedWorks returns only featured entries (test only)', () => {
    writeMdx('images', 'featured-one', {
      ...validMdxFrontmatter, slug: 'featured-one', featured: true,
      src: '/media/images/f1.png', thumbnail: '/media/thumbnails/f1.webp',
    })
    writeMdx('images', 'not-featured', {
      ...validMdxFrontmatter, slug: 'not-featured', featured: false,
      src: '/media/images/nf.png', thumbnail: '/media/thumbnails/nf.webp', title: 'Not Featured',
    })
    writeMedia('images', 'f1.png')
    writeMedia('images', 'nf.png')
    createdMdx.push('images/featured-one.mdx', 'images/not-featured.mdx')
    createdMedia.push('images/f1.png', 'images/nf.png')

    const featured = testOnly(getFeaturedWorks())
    expect(featured).toHaveLength(1)
    expect(featured[0].slug).toBe('featured-one')
    expect(featured[0].featured).toBe(true)
  })

  it('handles different media types in correct subdirs', () => {
    writeMedia('images', 'landscape.jpg')
    writeMedia('videos', 'drone.mp4')
    writeMedia('audio', 'ambient.wav')
    writeMedia('text', 'essay.md')
    createdMedia.push('images/landscape.jpg', 'videos/drone.mp4', 'audio/ambient.wav', 'text/essay.md')

    const works = testOnly(getAllWorks())
    expect(works).toHaveLength(4)

    const landscape = getWork('landscape')
    expect(landscape!.type).toBe('image')
    const drone = getWork('drone')
    expect(drone!.type).toBe('video')
    const ambient = getWork('ambient')
    expect(ambient!.type).toBe('audio')
    const essay = getWork('essay')
    expect(essay!.type).toBe('text')
  })

  it('recursively scans subdirectories into category and src', () => {
    writeMedia('images/风景', 'mountain.png')
    writeMedia('images/邦邦乐队/动画', 'band.png')
    writeMedia('images', 'bare-root.png')
    createdMedia.push('images/风景/mountain.png', 'images/邦邦乐队/动画/band.png', 'images/bare-root.png')

    const works = testOnly(getAllWorks())
    const mountain = works.find(w => w.slug === 'mountain')
    const band = works.find(w => w.slug === 'band')
    const root = works.find(w => w.slug === 'bare-root')
    expect(mountain!.category).toBe('风景')
    expect(mountain!.src).toBe('/media/images/风景/mountain.png')
    expect(band!.category).toBe('邦邦乐队/动画')
    expect(root!.category).toBeUndefined()
  })

  it('getCategories includes parent paths, deduped and sorted', () => {
    writeMedia('images/邦邦乐队/动画', 'band.png')
    writeMedia('images/邦邦乐队', 'live.png')
    writeMedia('images/风景', 'mountain.png')
    createdMedia.push('images/邦邦乐队/动画/band.png', 'images/邦邦乐队/live.png', 'images/风景/mountain.png')

    const cats = getCategories()
    expect(cats).toContain('邦邦乐队')
    expect(cats).toContain('邦邦乐队/动画')
    expect(cats).toContain('风景')
    expect(new Set(cats).size).toBe(cats.length)
  })

  it('derives category for MDX entries from a subdirectory src, without the filename', () => {
    writeMdx('images', 'mountain', {
      title: 'Mountain',
      type: 'image',
      date: '2026-01-01',
      src: '/media/images/风景/mountain.png',
      thumbnail: '/media/thumbnails/mountain.webp',
    })
    writeMedia('images/风景', 'mountain.png')
    createdMdx.push('images/mountain.mdx')
    createdMedia.push('images/风景/mountain.png')

    const work = getWork('mountain')
    expect(work!.category).toBe('风景')
  })
})
