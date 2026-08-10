import type { Metadata } from 'next'
import PrivateGallery from '@/components/private/PrivateGallery'

export const metadata: Metadata = {
  title: '私密画廊 — Ser3nus Gallery',
}

export default function PrivatePage() {
  return <PrivateGallery />
}
