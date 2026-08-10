'use client'

import { useState } from 'react'
import type { WorkEntry } from '@/lib/types'
import CategoryFilter from './CategoryFilter'
import GalleryGrid from './GalleryGrid'

export default function CategoryWorks({ works, categories }: { works: WorkEntry[]; categories: string[] }) {
  const [active, setActive] = useState<string | null>(null)
  const filtered = active
    ? works.filter((w) => w.category === active || w.category?.startsWith(active + '/'))
    : works
  return (
    <>
      <CategoryFilter categories={categories} active={active} onSelect={setActive} />
      <GalleryGrid works={filtered} />
    </>
  )
}
