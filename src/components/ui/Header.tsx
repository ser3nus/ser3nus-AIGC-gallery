import Link from 'next/link'
import { getAllWorks } from '@/lib/content'
import SearchInput from './SearchInput'

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: '全部', href: '/' },
  { label: '图片', href: '/category/image' },
  { label: '视频', href: '/category/video' },
  { label: '音频', href: '/category/audio' },
  { label: '文本', href: '/category/text' },
]

export default function Header() {
  const works = getAllWorks()

  return (
    <header className="sticky top-0 z-50 bg-warm-50/90 backdrop-blur border-b border-warm-200">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide text-warm-800 hover:text-warm-600 transition-colors">
          Ser3nus Gallery
        </Link>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6 text-sm tracking-widest uppercase">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-warm-500 hover:text-warm-800 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <SearchInput works={works} />
        </div>
      </nav>
    </header>
  )
}
