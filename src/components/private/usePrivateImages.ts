'use client'

import { useState, useCallback } from 'react'
import { base64ToBytes, deriveKey, decryptBytes } from '@/lib/private-crypto'
import { assetPath } from '@/lib/paths'

export interface PrivateImage { slug: string; title: string; url: string; category?: string }
export type UnlockStatus = 'idle' | 'loading' | 'unlocked' | 'error'

interface ManifestImage { slug: string; file: string; category?: string }
interface Manifest { salt: string; iterations: number; images: ManifestImage[] }

function titleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function usePrivateImages() {
  const [status, setStatus] = useState<UnlockStatus>('idle')
  const [images, setImages] = useState<PrivateImage[]>([])

  const unlock = useCallback(async (password: string) => {
    try {
      setStatus('loading')
      const res = await fetch(assetPath('/media/private/manifest.json'))
      if (!res.ok) throw new Error('manifest not found')
      const manifest: Manifest = await res.json()
      const salt = base64ToBytes(manifest.salt)
      const key = await deriveKey(password, salt, manifest.iterations)

      const urls: PrivateImage[] = []
      for (const img of manifest.images) {
        const data = await (await fetch(assetPath(`/media/private/${img.file}`))).json()
        const plain = await decryptBytes(key, base64ToBytes(data.iv), base64ToBytes(data.ciphertext))
        const blob = new Blob([plain as Uint8Array<ArrayBuffer>])
        urls.push({ slug: img.slug, title: titleFromSlug(img.slug), url: URL.createObjectURL(blob), category: img.category })
      }
      setImages(urls)
      setStatus('unlocked')
    } catch {
      setImages([])
      setStatus('error')
    }
  }, [])

  return { status, unlock, images }
}
