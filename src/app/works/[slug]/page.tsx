import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { getAllWorks, getWork } from '@/lib/content'
import MediaViewer from '@/components/viewer/MediaViewer'
import MetaPanel from '@/components/meta/MetaPanel'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return getAllWorks().map(w => ({ slug: w.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const work = getWork(params.slug)
  if (!work) return { title: '作品未找到' }
  return {
    title: `${work.title} — Ser3nus Gallery`,
    description: work.prompt ?? work.description ?? undefined,
  }
}

export default function WorkDetailPage({ params }: Props) {
  const work = getWork(params.slug)
  if (!work) notFound()

  const allWorks = getAllWorks()
  const currentIndex = allWorks.findIndex(w => w.slug === work.slug)
  const prev = currentIndex > 0 ? allWorks[currentIndex - 1] : null
  const next = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null

  const filePath = path.join(process.cwd(), 'public', work.src)
  const fileExists = fs.existsSync(filePath)

  return (
    <article className="max-w-4xl mx-auto">
      {!fileExists && (
        <div className="text-center py-8 mb-6 bg-warm-100 rounded-xl">
          <p className="text-warm-400 italic">文件尚未上传</p>
          <p className="text-xs text-warm-300 mt-1 font-mono">{work.src}</p>
        </div>
      )}
      {fileExists && <MediaViewer work={work} />}

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-warm-800">{work.title}</h1>
          <time className="text-sm text-warm-400">{work.date}</time>
        </div>
        <div className="flex gap-4">
          {prev && <Link href={`/works/${prev.slug}`} className="text-sm text-warm-500 hover:text-warm-700 transition-colors">← {prev.title}</Link>}
          {next && <Link href={`/works/${next.slug}`} className="text-sm text-warm-500 hover:text-warm-700 transition-colors">{next.title} →</Link>}
        </div>
      </div>

      <MetaPanel work={work} />
    </article>
  )
}
