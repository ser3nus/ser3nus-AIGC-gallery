'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { WorkEntry } from '@/lib/types'
import { assetPath } from '@/lib/paths'

const TYPE_ICONS: Record<string, string> = {
  image: '🖼', video: '🎬', audio: '🎵', text: '📝',
}

export default function WorkCard({ work }: { work: WorkEntry }) {
  return (
    <Link href={`/works/${work.slug}`}>
      <article className="group relative overflow-hidden rounded-lg border border-warm-200 bg-white shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300">
        <div className="aspect-[4/3] relative bg-warm-100">
          {(work.thumbnail || (work.type === 'image' ? work.src : '')) ? (
            <Image src={assetPath(work.thumbnail || work.src)} alt={work.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl text-warm-300">{TYPE_ICONS[work.type] || '📄'}</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs">{TYPE_ICONS[work.type]}</span>
            <h3 className="font-serif text-lg text-warm-800 truncate">{work.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {work.model && <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-500">{work.model}</span>}
            {work.isBare && <span className="text-xs px-2 py-0.5 rounded-full bg-warm-200/50 text-warm-400 italic">未添加描述</span>}
          </div>
        </div>
        {work.prompt && (
          <div className="absolute inset-0 bg-warm-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
            <p className="text-warm-50 text-sm leading-relaxed line-clamp-4 text-center italic">"{work.prompt}"</p>
          </div>
        )}
      </article>
    </Link>
  )
}
