'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ImageViewer({ src, alt }: { src: string; alt: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <>
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-warm-100 cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
        <Image src={src} alt={alt} fill className="object-contain" priority />
      </div>
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-warm-900/95 flex items-center justify-center cursor-zoom-out" onClick={() => setIsFullscreen(false)}>
          <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] m-auto">
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  )
}
