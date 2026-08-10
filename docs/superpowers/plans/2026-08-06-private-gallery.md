# Private Gallery（私密画廊）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一个隐藏入口的私密画廊 `/private`，NSFW 图片以 AES-256-GCM 密文存于仓库，访客输入固定密码后前端解密浏览。

**Architecture:** 密码即密钥。本地 `tsx` 脚本用 PBKDF2+AES-GCM 把 `private-src/` 明文图加密成 `.enc.json` 密文 + `manifest.json`，写入 `public/media/private/`。前端 `/private` 页 fetch manifest，用户输密码 → PBKDF2 派生密钥 → AES-GCM 解密全部图片 → 网格+大图。仓库永不存密码/明文。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript、Tailwind v4、Web Crypto API（`crypto.subtle`，Node 与浏览器共用）、tsx（运行加密脚本）、vitest。

## Global Constraints

- 纯静态导出 `output: 'export'`，无服务器，无后端鉴权。
- 解密在浏览器端，算法公开，**密码是唯一防线**。
- 密码为字母+数字+符号 8-10 位；PBKDF2 迭代次数 100 万（测试用 1000）。
- 仓库中绝不出现：明文 NSFW 图、密码、密码哈希。
- 入口隐藏：`/private` 路由存在，但 Header 导航不添加链接。
- 复用现有 `assetPath()`（`src/lib/paths.ts`）为所有 `/media/private/...` URL 加 basePath。
- 标题由文件名 slug 化派生（复用 content.ts 的 slugify 规则：非 ASCII → `work-<hash>`）。
- 测试遵循现有模式：`src/lib/*.test.ts`（vitest）；private-crypto 测试需 `// @vitest-environment node`（jsdom 缺 Web Crypto）。
- 本计划期间如用户维持"别提交"指示，各任务 commit 步骤暂缓执行。

---

### Task 1: private-crypto 加解密库 + 测试

**Files:**
- Create: `src/lib/private-crypto.ts`
- Create: `src/lib/private-crypto.test.ts`

**Interfaces:**
- Produces (供 Task 2/3 使用)：
  - `bytesToBase64(bytes: Uint8Array): string`
  - `base64ToBytes(b64: string): Uint8Array`
  - `generateSalt(): Uint8Array`（16 字节）
  - `deriveKey(password: string, salt: Uint8Array, iterations?: number): Promise<CryptoKey>`（PBKDF2-SHA256 → AES-GCM 256 位密钥；默认迭代 1000000）
  - `encryptBytes(key: CryptoKey, data: Uint8Array): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }>`（AES-GCM，iv 12 字节随机）
  - `decryptBytes(key: CryptoKey, iv: Uint8Array, ciphertext: Uint8Array): Promise<Uint8Array>`（认证失败时 reject）

- [ ] **Step 1: Write the failing test**

`src/lib/private-crypto.test.ts`：

```ts
// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  bytesToBase64, base64ToBytes, generateSalt, deriveKey, encryptBytes, decryptBytes,
} from './private-crypto'

describe('private-crypto', () => {
  it('base64 round-trips any bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 255, 128])
    expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes)
  })

  it('encrypts and decrypts a message with the same key', async () => {
    const salt = generateSalt()
    const key = await deriveKey('P@ssw0rd!9', salt, 1000)
    const data = new TextEncoder().encode('secret image bytes')
    const { iv, ciphertext } = await encryptBytes(key, data)
    const plain = await decryptBytes(key, iv, ciphertext)
    expect(new TextDecoder().decode(plain)).toBe('secret image bytes')
  })

  it('rejects decryption with a wrong password (auth tag mismatch)', async () => {
    const salt = generateSalt()
    const key = await deriveKey('correct-pass', salt, 1000)
    const wrongKey = await deriveKey('wrong-pass!!', salt, 1000)
    const { iv, ciphertext } = await encryptBytes(key, new TextEncoder().encode('x'))
    await expect(decryptBytes(wrongKey, iv, ciphertext)).rejects.toThrow()
  })

  it('generates unique salt each call', () => {
    expect(generateSalt()).not.toEqual(generateSalt())
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/private-crypto.test.ts`
Expected: FAIL — module not found / function not defined

- [ ] **Step 3: Write minimal implementation**

`src/lib/private-crypto.ts`：

```ts
/** Base64 helpers usable in both Node (script) and browsers. btoa/atob are
 *  global in Node 20+ and all modern browsers. */

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

const enc = new TextEncoder()

/** Derive an AES-GCM key from a password via PBKDF2-SHA256. */
export async function deriveKey(password: string, salt: Uint8Array, iterations = 1000000): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/** AES-256-GCM encrypt. Returns random 12-byte IV + ciphertext (tag appended). */
export async function encryptBytes(key: CryptoKey, data: Uint8Array): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data))
  return { iv, ciphertext }
}

/** AES-256-GCM decrypt. Rejects if authentication fails (wrong key/IV). */
export async function decryptBytes(key: CryptoKey, iv: Uint8Array, ciphertext: Uint8Array): Promise<Uint8Array> {
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return new Uint8Array(plaintext)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/private-crypto.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/private-crypto.ts src/lib/private-crypto.test.ts
git commit -m "feat: AES-GCM + PBKDF2 crypto helpers for private gallery"
```

---

### Task 2: 加密脚本 + manifest + gitignore

**Files:**
- Create: `scripts/encrypt-private.ts`
- Modify: `package.json`（加 devDependency `tsx` + script `encrypt-private`）
- Modify: `.gitignore`（加 `/private-src/`）

**Interfaces:**
- Consumes: `src/lib/private-crypto.ts` 的 `generateSalt/deriveKey/encryptBytes/bytesToBase64`（Task 1）
- Produces（供 Task 3 前端读取）：`public/media/private/manifest.json`，格式：
  ```json
  { "salt": "<b64>", "iterations": 1000000, "images": [{ "slug": "xxx", "file": "xxx.enc.json" }] }
  ```

- [ ] **Step 1: 确认 tsx 依赖并安装**

Run: `npm install -D tsx`
Expected: 安装成功，`package.json` devDependencies 出现 `"tsx": "^4.x"`

- [ ] **Step 2: 写加密脚本**

`scripts/encrypt-private.ts`：

```ts
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

const images: { slug: string; file: string }[] = []
for (const entry of fs.readdirSync(SRC_DIR, { withFileTypes: true })) {
  if (!entry.isFile()) continue
  const srcPath = path.join(SRC_DIR, entry.name)
  const bytes = new Uint8Array(fs.readFileSync(srcPath))
  const { iv, ciphertext } = await encryptBytes(key, bytes)
  const slug = slugify(entry.name)
  const file = `${slug}.enc.json`
  fs.writeFileSync(
    path.join(OUT_DIR, file),
    JSON.stringify({ iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) }),
  )
  images.push({ slug, file })
  console.log(`✓ encrypted ${entry.name} -> ${file}`)
}

const manifest = { salt: bytesToBase64(salt), iterations: ITERATIONS, images }
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`✓ wrote manifest.json (${images.length} images)`)
console.log('⚠️  Delete private-src/* plaintext files now (gitignored, but keep the drive clean).')
```

- [ ] **Step 3: 更新 package.json 与 .gitignore**

`package.json` scripts 加：
```json
"encrypt-private": "tsx scripts/encrypt-private.ts"
```
（tsx devDependency 在 Step 1 已加。）

`.gitignore` 末尾追加：
```
# private gallery plaintext source
/private-src/
```

- [ ] **Step 4: 端到端验证脚本可加密**

Run:
```bash
mkdir -p private-src
cp public/media/images/anima_base_v1_0-none-artistmixer_00001_.png private-src/demo.png
npm run encrypt-private   # 输入密码 testpass123
node -e "console.log(require('fs').readdirSync('public/media/private'))"
```
Expected: `public/media/private/` 出现 `demo.enc.json` + `manifest.json`；manifest.images 含 `demo.png` 对应项。用 `npx vitest run src/lib/private-crypto.test.ts` 确认往返逻辑（Task 1 已覆盖）仍在 PASS。

再验证可还原：
```bash
npx vitest run src/lib/private-crypto.test.ts
```
（往返逻辑已由 Task 1 测试覆盖；脚本用同一套函数，此处仅确认文件产出。）

- [ ] **Step 5: 清理验证产物并 Commit**

Run:
```bash
rm -rf private-src public/media/private
```
Expected: 无残留。

```bash
git add scripts/encrypt-private.ts package.json package-lock.json .gitignore
git commit -m "feat: local encrypt script for private gallery images"
```

---

### Task 3: usePrivateImages 解密 hook

**Files:**
- Create: `src/components/private/usePrivateImages.ts`

**Interfaces:**
- Consumes: `src/lib/private-crypto.ts` 的 `base64ToBytes/deriveKey/decryptBytes`（Task 1）；`src/lib/paths.ts` 的 `assetPath`；`public/media/private/manifest.json`（Task 2 产出）
- Produces（供 Task 4 使用）：
  ```ts
  interface PrivateImage { slug: string; title: string; url: string }
  type UnlockStatus = 'idle' | 'unlocked' | 'error'
  function usePrivateImages(): {
    status: UnlockStatus
    unlock: (password: string) => Promise<void>
    images: PrivateImage[]
  }
  ```

- [ ] **Step 1: 写 hook**

`src/components/private/usePrivateImages.ts`：

```ts
'use client'

import { useState, useCallback } from 'react'
import { base64ToBytes, deriveKey, decryptBytes } from '@/lib/private-crypto'
import { assetPath } from '@/lib/paths'

export interface PrivateImage { slug: string; title: string; url: string }
export type UnlockStatus = 'idle' | 'unlocked' | 'error'

interface ManifestImage { slug: string; file: string }
interface Manifest { salt: string; iterations: number; images: ManifestImage[] }

function titleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function usePrivateImages() {
  const [status, setStatus] = useState<UnlockStatus>('idle')
  const [images, setImages] = useState<PrivateImage[]>([])

  const unlock = useCallback(async (password: string) => {
    try {
      setStatus('idle')
      const res = await fetch(assetPath('/media/private/manifest.json'))
      if (!res.ok) throw new Error('manifest not found')
      const manifest: Manifest = await res.json()
      const salt = base64ToBytes(manifest.salt)
      const key = await deriveKey(password, salt, manifest.iterations)

      const urls: PrivateImage[] = []
      for (const img of manifest.images) {
        const data = await (await fetch(assetPath(`/media/private/${img.file}`))).json()
        const plain = await decryptBytes(key, base64ToBytes(data.iv), base64ToBytes(data.ciphertext))
        const blob = new Blob([plain])
        urls.push({ slug: img.slug, title: titleFromSlug(img.slug), url: URL.createObjectURL(blob) })
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
```

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS（无新错误）

- [ ] **Step 3: Commit**

```bash
git add src/components/private/usePrivateImages.ts
git commit -m "feat: private gallery decrypt hook"
```

---

### Task 4: PrivateCard + PrivateGallery 组件

**Files:**
- Create: `src/components/private/PrivateCard.tsx`
- Create: `src/components/private/PrivateGallery.tsx`

**Interfaces:**
- Consumes: `usePrivateImages` 及 `PrivateImage`（Task 3）
- Produces（供 Task 5 页面渲染）：`<PrivateGallery />` 默认导出，无 props

- [ ] **Step 1: 写 PrivateCard**

`src/components/private/PrivateCard.tsx`：

```tsx
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
```

- [ ] **Step 2: 写 PrivateGallery**

`src/components/private/PrivateGallery.tsx`：

```tsx
'use client'

import { useState } from 'react'
import { usePrivateImages, type PrivateImage } from './usePrivateImages'
import PrivateCard from './PrivateCard'

export default function PrivateGallery() {
  const { status, unlock, images } = usePrivateImages()
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState<PrivateImage | null>(null)

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="font-serif text-3xl text-warm-800 mb-8 text-center">私密画廊</h1>

      {status !== 'unlocked' && (
        <div className="max-w-sm mx-auto bg-white rounded-xl border border-warm-200 p-8 text-center">
          <p className="text-warm-500 mb-4 text-sm">此区域需要密码访问</p>
          <form onSubmit={(e) => { e.preventDefault(); unlock(password) }} className="space-y-4">
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="输入访问密码" autoFocus
              className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm focus:outline-none focus:border-warm-500"
            />
            <button type="submit" className="w-full px-4 py-2 rounded-lg bg-warm-700 text-warm-50 text-sm hover:bg-warm-800 transition-colors">
              {status === 'idle' ? '解锁' : '解锁中…'}
            </button>
          </form>
          {status === 'error' && <p className="text-red-500 text-xs mt-3">密码错误，或画廊未正确配置</p>}
        </div>
      )}

      {status === 'unlocked' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img) => <PrivateCard key={img.slug} image={img} onOpen={setOpen} />)}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-zoom-out" onClick={() => setOpen(null)}>
          <img src={open.url} alt={open.title} className="max-w-[95vw] max-h-[92vh] object-contain" />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 类型检查 + 构建验证**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/private/PrivateCard.tsx src/components/private/PrivateGallery.tsx
git commit -m "feat: private gallery grid and password gate UI"
```

---

### Task 5: /private 路由页面

**Files:**
- Create: `src/app/private/page.tsx`
- Modify: `src/components/ui/Header.tsx`（确认**不加**私密入口——只核对不改）

**Interfaces:**
- Consumes: `<PrivateGallery />`（Task 4）
- Produces: 静态路由 `/private`

- [ ] **Step 1: 写页面**

`src/app/private/page.tsx`：

```tsx
import type { Metadata } from 'next'
import PrivateGallery from '@/components/private/PrivateGallery'

export const metadata: Metadata = {
  title: '私密画廊 — Ser3nus Gallery',
}

export default function PrivatePage() {
  return <PrivateGallery />
}
```

- [ ] **Step 2: 确认 Header 无入口 + 静态构建含 /private**

Run: `grep -n "private" src/components/ui/Header.tsx`
Expected: 无输出（Header 不引用 private）

Run: `npm run build`
Expected: 成功，路由列表出现 `○ /private`

- [ ] **Step 3: Commit**

```bash
git add src/app/private/page.tsx
git commit -m "feat: /private route for password-protected gallery"
```

---

### Task 6: 端到端验证（本地全流程）

**Files:**
- 无代码改动（验证用）

- [ ] **Step 1: 本地加密一张图并起 dev server 验证**

Run:
```bash
mkdir -p private-src
cp public/media/images/anima_base_v1_0-none-artistmixer_00001_.png private-src/demo.png
npm run encrypt-private    # 输入测试密码
npm run dev                # 新终端
```
Expected: 访问 `http://localhost:3000/private` → 密码门 → 输入测试密码 → 网格显示 demo 图 → 点开大图正常。错误密码 → 提示"密码错误"。

- [ ] **Step 2: 清理验证产物**

Run:
```bash
rm -rf private-src public/media/private
```

- [ ] **Step 3: 最终构建 + 全量测试**

Run: `npx vitest run && npm run build`
Expected: 所有测试通过，构建成功，`/private` 在路由列表。

- [ ] **Step 4: 通知用户放行部署**

> 等用户确认放行后：`git push origin main` 触发 GitHub Actions 自动部署，线上出现 `/private`。之后用户放明文图到 `private-src/` 跑 `npm run encrypt-private`，commit 密文，push 即可更新私密内容。
