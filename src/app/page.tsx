import fs from 'fs'
import path from 'path'
import { getBannerWorks } from '@/lib/content'
import HeroBanner from '@/components/gallery/HeroBanner'

function getBackgroundImage(): string | null {
  const bgDir = path.join(process.cwd(), 'public', 'media', 'background')
  if (!fs.existsSync(bgDir)) return null
  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.avif']
  for (const entry of fs.readdirSync(bgDir, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith('.')) continue
    if (exts.includes(path.extname(entry.name).toLowerCase())) {
      return `/media/background/${entry.name}`
    }
  }
  return null
}

export default function HomePage() {
  const works = getBannerWorks()
  const bg = getBackgroundImage()

  return (
    <div className="relative">
      {bg && (
        <div
          className="fixed inset-0 z-0 opacity-45 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bg}')` }}
        />
      )}

      <div className="relative z-10">
        <section className="text-center py-8">
          <h1 className="font-serif text-5xl font-bold text-warm-900 drop-shadow-md">Ser3nus AIGC Gallery</h1>
        </section>
        <HeroBanner works={works} />
      </div>
    </div>
  )
}
