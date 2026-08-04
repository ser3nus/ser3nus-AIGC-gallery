'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { WorkEntry } from '@/lib/types'
import { assetPath } from '@/lib/paths'

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
    <div className="flex items-center gap-3 mb-12 relative">
      {/* Left arrow */}
      {works.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 sm:static sm:left-auto sm:top-auto sm:translate-y-0 shrink-0 w-12 h-12 rounded-full bg-white border border-warm-200 shadow-md hover:bg-warm-50 text-warm-600 text-2xl flex items-center justify-center transition-colors"
          aria-label="上一张"
        >
          ‹
        </button>
      )}

      <div className="relative flex-1 aspect-[1/1] max-h-[80vh] rounded-xl overflow-hidden group sm:aspect-[4/3]">
        <Link href={`/works/${work.slug}`}>
          {(work.thumbnail || work.src) ? (
            <Image src={assetPath(work.thumbnail || work.src)} alt={work.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer" priority />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-warm-900/80 via-transparent to-transparent" />
        </Link>

        {/* Info overlay */}
        <Link href={`/works/${work.slug}`}>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 cursor-pointer">
            <p className="hidden sm:block text-warm-200 text-sm mb-2 tracking-widest uppercase">Featured</p>
            <h2 className="font-serif text-2xl sm:text-4xl text-white mb-1 sm:mb-2">{work.title}</h2>
            {work.prompt && <p className="hidden sm:block text-warm-200 text-sm italic line-clamp-2">&ldquo;{work.prompt}&rdquo;</p>}
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
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 sm:static sm:right-auto sm:top-auto sm:translate-y-0 shrink-0 w-12 h-12 rounded-full bg-white border border-warm-200 shadow-md hover:bg-warm-50 text-warm-600 text-2xl flex items-center justify-center transition-colors"
          aria-label="下一张"
        >
          ›
        </button>
      )}
    </div>
  )
}
