'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { WorkEntry } from '@/lib/types'

export default function HeroBanner({ works }: { works: WorkEntry[] }) {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => setCurrent(c => (c - 1 + works.length) % works.length), [works.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % works.length), [works.length])

  useEffect(() => {
    if (works.length <= 1) return
    const timer = setInterval(() => next(), 5000)
    return () => clearInterval(timer)
  }, [works.length, next])

  if (works.length === 0) return null

  const work = works[current]
  return (
    <div className="flex items-center gap-3 mb-12">
      {/* Left arrow */}
      {works.length > 1 && (
        <button
          onClick={prev}
          className="shrink-0 w-12 h-12 rounded-full bg-white border border-warm-200 shadow-md hover:bg-warm-50 text-warm-600 text-2xl flex items-center justify-center transition-colors"
          aria-label="上一张"
        >
          ‹
        </button>
      )}

      <div className="relative flex-1 h-[80vh] min-h-[560px] rounded-xl overflow-hidden group">
        <Link href={`/works/${work.slug}`}>
          {(work.thumbnail || work.src) ? (
            <Image src={work.thumbnail || work.src} alt={work.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer" priority />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-warm-900/80 via-transparent to-transparent" />
        </Link>

        {/* Info overlay */}
        <Link href={`/works/${work.slug}`}>
          <div className="absolute bottom-0 left-0 right-0 p-8 cursor-pointer">
            <p className="text-warm-200 text-sm mb-2 tracking-widest uppercase">Featured</p>
            <h2 className="font-serif text-4xl text-white mb-2">{work.title}</h2>
            {work.prompt && <p className="text-warm-200 text-sm italic line-clamp-2">&ldquo;{work.prompt}&rdquo;</p>}
          </div>
        </Link>

        {/* Dot indicators */}
        {works.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {works.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
                aria-label={`第 ${i + 1} 张`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right arrow */}
      {works.length > 1 && (
        <button
          onClick={next}
          className="shrink-0 w-12 h-12 rounded-full bg-white border border-warm-200 shadow-md hover:bg-warm-50 text-warm-600 text-2xl flex items-center justify-center transition-colors"
          aria-label="下一张"
        >
          ›
        </button>
      )}
    </div>
  )
}
