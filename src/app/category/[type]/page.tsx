import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getWorksByType } from '@/lib/content'
import type { WorkType } from '@/lib/types'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import FilterBar from '@/components/gallery/FilterBar'

const VALID_TYPES: WorkType[] = ['image', 'video', 'audio', 'text']
const TYPE_LABELS: Record<WorkType, string> = {
  image: '图片', video: '视频', audio: '音频', text: '文本',
}

interface Props { params: { type: string } }

export function generateStaticParams() {
  return VALID_TYPES.map(type => ({ type }))
}

export function generateMetadata({ params }: Props): Metadata {
  const type = params.type as WorkType
  if (!VALID_TYPES.includes(type)) return { title: '未知分类' }
  return { title: `${TYPE_LABELS[type]} — Ser3nus Gallery` }
}

export default function CategoryPage({ params }: Props) {
  const type = params.type as WorkType
  if (!VALID_TYPES.includes(type)) notFound()

  const works = getWorksByType(type)

  return (
    <>
      <FilterBar />
      {works.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif text-xl text-warm-400 italic mb-4">该分类暂无作品</p>
          <Link href="/" className="text-sm text-warm-500 hover:text-warm-700 underline underline-offset-4">返回首页</Link>
        </div>
      ) : (
        <GalleryGrid works={works} />
      )}
    </>
  )
}
