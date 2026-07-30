export type WorkType = 'image' | 'video' | 'audio' | 'text'

export interface WorkEntry {
  slug: string
  title: string
  type: WorkType
  date: string
  src: string
  thumbnail?: string
  category?: string
  model: string | null
  prompt: string | null
  negativePrompt?: string
  parameters?: Record<string, unknown>
  seed?: number
  generatedAt?: string
  featured: boolean
  tags: string[]
  description?: string
  isBare: boolean
}

export type WorksIndex = WorkEntry[]
