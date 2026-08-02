'use client'

import { useState, useEffect } from 'react'

interface Section {
  id: string
  title: string
}

export default function TocNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%' },
    )

    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav className="hidden md:block shrink-0 w-48">
      <div className="sticky top-24">
        <p className="text-xs uppercase tracking-wider text-warm-400 mb-3">目录</p>
        <ul className="space-y-1 border-l-2 border-warm-200">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`block py-1.5 pl-4 text-sm transition-colors border-l-2 -ml-0.5 ${
                  activeId === s.id
                    ? 'border-warm-700 text-warm-800 font-medium'
                    : 'border-transparent text-warm-500 hover:text-warm-700'
                }`}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
