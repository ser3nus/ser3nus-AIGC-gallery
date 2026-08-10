const IS_DEV = process.env.NODE_ENV === 'development'
const BASE = IS_DEV ? '' : '/ser3nus-AIGC-gallery'

/** Prefix a public asset path with the GitHub Pages basePath (production only) */
export function assetPath(p: string): string {
  return `${BASE}${p}`
}
