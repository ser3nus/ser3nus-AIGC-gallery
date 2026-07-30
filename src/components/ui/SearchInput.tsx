'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { WorkEntry } from '@/lib/types'

export default function SearchInput({ works }: { works: WorkEntry[] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const results = query.length > 0
    ? works.filter(w =>
        w.title.toLowerCase().includes(query.toLowerCase()) ||
        (w.prompt && w.prompt.toLowerCase().includes(query.toLowerCase())) ||
        w.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : []

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-48">
      <input type="search" placeholder="搜索作品..." value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className="w-full text-sm px-3 py-1.5 rounded-full border border-warm-300 bg-white/50 text-warm-700 placeholder-warm-400 focus:outline-none focus:border-warm-500 transition-colors"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg border border-warm-200 shadow-lg overflow-hidden z-50">
          {results.map(w => (
            <Link key={w.slug} href={`/works/${w.slug}`} onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-warm-50 transition-colors">
              <p className="text-sm text-warm-800 truncate">{w.title}</p>
              {w.model && <p className="text-xs text-warm-400">{w.model}</p>}
            </Link>
          ))}
        </div>
      )}
      {open && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg border border-warm-200 shadow-lg p-4 text-center text-sm text-warm-400 z-50">
          未找到匹配的作品
        </div>
      )}
    </div>
  )
}
