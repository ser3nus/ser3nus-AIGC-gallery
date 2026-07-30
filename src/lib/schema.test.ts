import { describe, it, expect } from 'vitest'
import { workEntrySchema } from './schema'

const validImage = {
  slug: 'sunset',
  title: 'Sunset',
  type: 'image' as const,
  date: '2026-07-15',
  src: '/media/images/sunset.png',
  thumbnail: '/media/thumbnails/sunset.webp',
  model: 'Midjourney v6.1',
  prompt: 'A beautiful sunset',
}

describe('workEntrySchema', () => {
  it('accepts a valid image entry', () => {
    const result = workEntrySchema.safeParse(validImage)
    expect(result.success).toBe(true)
  })

  it('rejects missing slug', () => {
    const { slug, ...rest } = validImage
    const result = workEntrySchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects invalid slug format (uppercase)', () => {
    const result = workEntrySchema.safeParse({ ...validImage, slug: 'UPPERCASE' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid type', () => {
    const result = workEntrySchema.safeParse({ ...validImage, type: 'document' })
    expect(result.success).toBe(false)
  })

  it('accepts optional fields as undefined', () => {
    const minimal = {
      slug: 'minimal',
      title: 'Minimal',
      type: 'text' as const,
      date: '2026-01-01',
      src: '/media/text/minimal.md',
      model: 'GPT-4',
      prompt: 'Write something',
    }
    const result = workEntrySchema.safeParse(minimal)
    expect(result.success).toBe(true)
  })

  it('accepts text type without thumbnail', () => {
    const result = workEntrySchema.safeParse({
      ...validImage,
      type: 'text',
      src: '/media/text/poem.txt',
      thumbnail: undefined,
    })
    expect(result.success).toBe(true)
  })

  it('rejects image type without thumbnail', () => {
    const { thumbnail, ...rest } = validImage
    const result = workEntrySchema.safeParse(rest)
    expect(result.success).toBe(false)
  })
})
