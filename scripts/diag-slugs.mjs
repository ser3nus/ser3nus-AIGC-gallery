import { getAllWorks, getWork, getBannerWorks } from '../src/lib/content.ts'

const all = getAllWorks()
console.log('Total works:', all.length)

// Check all slugs
let bad = 0
for (const w of all) {
  const found = getWork(w.slug)
  if (!found) {
    console.log('  BAD:', w.slug, 'src:', w.src)
    bad++
  }
}
console.log('Bad slugs:', bad)

// Check banner specifically
const banner = getBannerWorks()
console.log('Banner works:', banner.length)
for (const w of banner) {
  const found = getWork(w.slug)
  console.log('  ' + w.slug + ' → ' + (found ? 'OK' : 'NULL'))
}

// Check sample slug
console.log('sample-sunset:', getWork('sample-sunset') ? 'OK' : 'NULL')
