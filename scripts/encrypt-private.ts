import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { generateSalt, deriveKey, encryptBytes, bytesToBase64 } from '../src/lib/private-crypto'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'private-src')
const OUT_DIR = path.join(ROOT, 'public', 'media', 'private')
const ITERATIONS = 1000000

/** Same slug rule as src/lib/content.ts slugify(). */
function slugify(name: string): string {
  const stem = path.basename(name).replace(/\.[^.]+$/, '')
  const ascii = stem.normalize('NFC').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()
  if (ascii.length > 0 && /[a-z0-9]/.test(ascii)) return ascii
  let h = 5381
  for (let i = 0; i < stem.length; i++) h = ((h << 5) + h + stem.charCodeAt(i)) | 0
  return 'work-' + Math.abs(h).toString(16).padStart(8, '0')
}

if (!fs.existsSync(SRC_DIR)) {
  console.error(`❌ No ${SRC_DIR}/ directory. Put plaintext images there first.`)
  process.exit(1)
}

const rl = readline.createInterface({ input: stdin, output: stdout })
const password = await rl.question('Enter private gallery password: ')
rl.close()
if (password.length < 8) {
  console.error('❌ Password must be at least 8 characters.')
  process.exit(1)
}

fs.mkdirSync(OUT_DIR, { recursive: true })
const salt = generateSalt()
const key = await deriveKey(password, salt, ITERATIONS)

const usedSlugs = new Set<string>()
const images: { slug: string; file: string; category?: string }[] = []

function uniqueSlug(base: string): string {
  let slug = base
  let i = 2
  while (usedSlugs.has(slug)) { slug = `${base}-${i}`; i++ }
  usedSlugs.add(slug)
  return slug
}

async function encryptDir(dirPath: string, category: string): Promise<void> {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      await encryptDir(full, category ? `${category}/${entry.name}` : entry.name)
    } else if (entry.isFile()) {
      const bytes = new Uint8Array(fs.readFileSync(full))
      const { iv, ciphertext } = await encryptBytes(key, bytes)
      const slug = uniqueSlug(slugify(entry.name))
      const file = `${slug}.enc.json`
      fs.writeFileSync(
        path.join(OUT_DIR, file),
        JSON.stringify({ iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) }),
      )
      images.push({ slug, file, category: category || undefined })
      console.log(`✓ encrypted ${entry.name} -> ${file}${category ? ` (${category})` : ''}`)
    }
  }
}

await encryptDir(SRC_DIR, '')

const manifest = { salt: bytesToBase64(salt), iterations: ITERATIONS, images }
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`✓ wrote manifest.json (${images.length} images)`)
console.log('⚠️  Delete private-src/* plaintext files now (gitignored, but keep the drive clean).')
