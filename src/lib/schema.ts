import { z } from 'zod'

const slugRegex = /^[a-z0-9-]+$/

const parametersSchema = z.record(z.string(), z.unknown()).optional()

export const workEntrySchema = z.object({
  slug: z.string().regex(slugRegex, 'slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1),
  type: z.enum(['image', 'video', 'audio', 'text']),
  date: z.string().min(1),
  src: z.string().min(1),
  thumbnail: z.string().optional(),
  category: z.string().optional(),
  model: z.string().nullable().default(null),
  prompt: z.string().nullable().default(null),
  negativePrompt: z.string().optional(),
  parameters: parametersSchema,
  seed: z.number().optional(),
  generatedAt: z.string().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  // Thumbnail is required for visual types (image, video, audio)
  if (data.type !== 'text' && !data.thumbnail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['thumbnail'],
      message: 'Thumbnail is required for image, video, and audio types',
    })
  }
})

export type WorkEntryFrontmatter = z.infer<typeof workEntrySchema>

export function validateWorkEntry(frontmatter: unknown): WorkEntryFrontmatter {
  return workEntrySchema.parse(frontmatter)
}
