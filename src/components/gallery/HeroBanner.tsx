'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { WorkEntry } from '@/lib/types'

export default function HeroBanner({ works }: { works: WorkEntry[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (works.length <= 1) return
    const timer = setInterval(() => setCurrent(c => (c + 1) % works.length), 5000)
    return () => clearInterval(timer)
  }, [works.length])

  if (works.length === 0) return null

  const work = works[current]
  return (
    <Link href={`/works/${work.slug}`}>
      <div className="relative h-[60vh] min-h-[400px] mb-16 rounded-xl overflow-hidden group cursor-pointer">
        {(work.thumbnail || work.src) ? (
          <Image src={work.thumbnail || work.src} alt={work.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <p className="text-warm-200 text-sm mb-2 tracking-widest uppercase">Featured</p>
          <h2 className="font-serif text-4xl text-white mb-2">{work.title}</h2>
          {work.prompt && <p className="text-warm-200 text-sm italic line-clamp-2">"{work.prompt}"</p>}
        </div>
        {works.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {works.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
