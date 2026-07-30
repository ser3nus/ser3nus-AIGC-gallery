import { getAllWorks, getFeaturedWorks } from '@/lib/content'
import HeroBanner from '@/components/gallery/HeroBanner'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import FilterBar from '@/components/gallery/FilterBar'

export default function HomePage() {
  const featured = getFeaturedWorks()
  const allWorks = getAllWorks()

  return (
    <>
      <HeroBanner works={featured} />
      <FilterBar />
      <GalleryGrid works={allWorks} />
    </>
  )
}
