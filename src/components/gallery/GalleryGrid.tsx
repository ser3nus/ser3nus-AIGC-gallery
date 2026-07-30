import type { WorkEntry } from '@/lib/types'
import WorkCard from './WorkCard'
import EmptyState from '@/components/ui/EmptyState'

export default function GalleryGrid({ works }: { works: WorkEntry[] }) {
  if (works.length === 0) {
    return <EmptyState message="将媒体文件放入 public/media/ 即可开始展示作品" />
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {works.map(work => (<WorkCard key={work.slug} work={work} />))}
    </div>
  )
}
