import type { Metadata } from 'next'
import { getAllWorks, getCategories } from '@/lib/content'
import CategoryWorks from '@/components/gallery/CategoryWorks'

export const metadata: Metadata = {
  title: '作品 — Ser3nus Gallery',
}

export default function WorksPage() {
  const works = getAllWorks()
  const categories = getCategories()
  return (
    <>
      <h1 className="font-serif text-3xl text-warm-800 mb-8 text-center">全部作品</h1>
      <CategoryWorks works={works} categories={categories} />
    </>
  )
}
