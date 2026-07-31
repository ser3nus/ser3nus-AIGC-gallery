import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllWorks, getWork } from '@/lib/content'
import MediaViewer from '@/components/viewer/MediaViewer'
import MetaPanel from '@/components/meta/MetaPanel'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const works = getAllWorks()
  return works.map(w => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const work = getWork(slug)
  if (!work) return { title: '作品未找到' }
  return {
    title: `${work.title} — Ser3nus Gallery`,
    description: work.prompt ?? work.description ?? undefined,
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params
  const work = getWork(slug)
  if (!work) notFound()

  const allWorks = getAllWorks()
  const currentIndex = allWorks.findIndex(w => w.slug === work.slug)
  const prev = currentIndex > 0 ? allWorks[currentIndex - 1] : null
  const next = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null

  return (
    <article className="max-w-4xl mx-auto">
      <MediaViewer work={work} />

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-warm-800">{work.title}</h1>
          {work.date && <time className="text-sm text-warm-400">{work.date}</time>}
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
