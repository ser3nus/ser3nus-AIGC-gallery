'use client'

import { useState } from 'react'
import { usePrivateImages, type PrivateImage } from './usePrivateImages'
import PrivateCard from './PrivateCard'
import CategoryFilter from '@/components/gallery/CategoryFilter'

export default function PrivateGallery() {
  const { status, unlock, images, progress } = usePrivateImages()
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState<PrivateImage | null>(null)
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const categories = Array.from(new Set(images.flatMap((img) => {
    const c = img.category
    if (!c) return []
    const parts = c.split('/')
    return Array.from({ length: parts.length }, (_, i) => parts.slice(0, i + 1).join('/'))
  }))).sort()

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="font-serif text-3xl text-warm-800 mb-8 text-center">私密画廊</h1>

      {status !== 'unlocked' && (
        <div className="max-w-sm mx-auto bg-white rounded-xl border border-warm-200 p-8 text-center">
          <p className="text-warm-500 mb-4 text-sm">此区域需要密码访问</p>
          <form onSubmit={(e) => { e.preventDefault(); unlock(password) }} className="space-y-4">
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="输入访问密码" autoFocus disabled={status === 'loading'}
              className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm focus:outline-none focus:border-warm-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button type="submit" disabled={status === 'loading'} className="w-full px-4 py-2 rounded-lg bg-warm-700 text-warm-50 text-sm hover:bg-warm-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'loading' ? '解锁中…' : '解锁'}
            </button>
          </form>
          {status === 'loading' && (
            <div className="mt-4">
              <div className="w-full h-1.5 bg-warm-100 rounded-full overflow-hidden">
                <div className="h-full bg-warm-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-warm-400 mt-1">{progress}%</p>
            </div>
          )}
          {status === 'error' && <p className="text-red-500 text-xs mt-3">密码错误，或画廊未正确配置</p>}
        </div>
      )}

      {status === 'unlocked' && (
        <>
          {categories.length > 0 && (
            <CategoryFilter categories={categories} active={activeCat} onSelect={setActiveCat} />
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.filter((img) => !activeCat || img.category === activeCat || img.category?.startsWith(activeCat + '/'))
              .map((img) => <PrivateCard key={img.slug} image={img} onOpen={setOpen} />)}
          </div>
        </>
      )}

      {open && (() => {
        const filtered = images.filter((img) => !activeCat || img.category === activeCat || img.category?.startsWith(activeCat + '/'))
        const idx = filtered.findIndex((img) => img.slug === open.slug)
        const prevImg = idx > 0 ? filtered[idx - 1] : null
        const nextImg = idx < filtered.length - 1 ? filtered[idx + 1] : null
        return (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setOpen(null)}>
            {prevImg && (
              <button className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white text-2xl flex items-center justify-center transition-colors" onClick={(e) => { e.stopPropagation(); setOpen(prevImg) }} aria-label="上一张">‹</button>
            )}
            {nextImg && (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white text-2xl flex items-center justify-center transition-colors" onClick={(e) => { e.stopPropagation(); setOpen(nextImg) }} aria-label="下一张">›</button>
            )}
            <img src={open.url} alt={open.title} className="max-w-[95vw] max-h-[92vh] object-contain cursor-zoom-out" onClick={(e) => { e.stopPropagation(); setOpen(null) }} />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-lg">{open.title}</p>
              {open.category && <p className="text-warm-200 text-sm">{open.category}</p>}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
