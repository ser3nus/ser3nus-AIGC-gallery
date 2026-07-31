import type { Metadata } from 'next'
import { getAllWorks } from '@/lib/content'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export const metadata: Metadata = {
  title: '作品 — Ser3nus Gallery',
}

export default function WorksPage() {
  const allWorks = getAllWorks()

  return (
    <>
      <h1 className="font-serif text-3xl text-warm-800 mb-8 text-center">全部作品</h1>
      <GalleryGrid works={allWorks} />
    </>
  )
}
