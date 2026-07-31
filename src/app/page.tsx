import { getFeaturedWorks } from '@/lib/content'
import HeroBanner from '@/components/gallery/HeroBanner'

export default function HomePage() {
  const featured = getFeaturedWorks()

  return (
    <>
      <HeroBanner works={featured} />
      <section className="text-center py-12">
        <h1 className="font-serif text-3xl text-warm-800 mb-4">Ser3nus AIGC Gallery</h1>
        <p className="text-warm-500 max-w-lg mx-auto leading-relaxed">
          A personal collection of AI-generated works — images, videos, audio, and text —
          each with its prompt, model, and creative parameters.
        </p>
      </section>
    </>
  )
}
