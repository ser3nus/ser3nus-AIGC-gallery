'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const FILTERS = [
  { label: '全部', href: '/', active: (path: string) => path === '/' },
  { label: '图片', href: '/category/image' },
  { label: '视频', href: '/category/video' },
  { label: '音频', href: '/category/audio' },
  { label: '文本', href: '/category/text' },
]

export default function FilterBar() {
  const pathname = usePathname()
  // trailingSlash: true makes usePathname return a trailing slash; compare without it
  const norm = (p: string) => (p === '/' ? '/' : p.replace(/\/+$/, ''))
  return (
    <div className="flex justify-center gap-2 mb-12">
      {FILTERS.map(({ label, href, active }) => {
        const isActive = active ? active(pathname) : norm(pathname) === norm(href)
        return (
          <Link key={href} href={href}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-warm-700 text-warm-50' : 'bg-white text-warm-500 hover:bg-warm-100 border border-warm-200'}`}>
            {label}
          </Link>
        )
      })}
    </div>
  )
}
