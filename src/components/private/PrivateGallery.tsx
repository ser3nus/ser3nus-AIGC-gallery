'use client'

import { useState } from 'react'
import { usePrivateImages, type PrivateImage } from './usePrivateImages'
import PrivateCard from './PrivateCard'
import CategoryFilter from '@/components/gallery/CategoryFilter'

export default function PrivateGallery() {
  const { status, unlock, images } = usePrivateImages()
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

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-zoom-out" onClick={() => setOpen(null)}>
          <img src={open.url} alt={open.title} className="max-w-[95vw] max-h-[92vh] object-contain" />
        </div>
      )}
    </div>
  )
}
