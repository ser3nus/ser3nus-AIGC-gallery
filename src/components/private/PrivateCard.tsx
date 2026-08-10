'use client'

import type { PrivateImage } from './usePrivateImages'

export default function PrivateCard({ image, onOpen }: { image: PrivateImage; onOpen: (img: PrivateImage) => void }) {
  return (
    <button onClick={() => onOpen(image)} className="group relative overflow-hidden rounded-lg border border-warm-200 bg-white shadow-sm hover:shadow-md transition-shadow aspect-[4/3]">
      <img src={image.url} alt={image.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-warm-900/70 to-transparent">
        <p className="text-sm text-warm-50 truncate">{image.title}</p>
      </div>
    </button>
  )
}
