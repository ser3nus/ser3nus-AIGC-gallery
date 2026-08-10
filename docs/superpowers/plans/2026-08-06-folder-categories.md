# 文件夹分类（Folder Categories）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 公开画廊与私密画廊都支持按文件夹自动分类，站点上用类别按钮筛选浏览。

**Architecture:** category 一律从作品 src 路径派生（`/media/images/邦邦乐队/动画/x.png` → `邦邦乐队/动画`），单一真实来源。公开侧 `scanMediaFiles` 改递归生成含子目录的 src + `getCategories()` 聚合；私密侧加密脚本递归 `private-src/` 并在 manifest 记 `category`。UI 用受控类别按钮条 + 前端过滤。

**Tech Stack:** Next.js 16、React 19、TypeScript、Tailwind v4、vitest、tsx（加密脚本）。

## Global Constraints

- 禁止 `git commit` / `git add`（用户指令持续有效）。所有改动留在工作区。
- category 是目录相对路径，**可为中文**（仅显示，不进入 URL slug）。slugify 逻辑不变。
- category 统一从 `work.src` 派生；`src` 格式 `/media/{dir}/{subpath}`。
- 递归扫描时跳过隐藏目录/文件（`.` 开头）。
- 过滤语义：active 类别 `cat` 匹配 `work.category === cat || work.category?.startsWith(cat + '/')`（大类含子类）。
- 现有类型筛选（图片/视频/音频/文本，`/category/[type]` 页）不受影响。
- 测试延续 `src/lib/*.test.ts`（vitest, jsdom）。已有测试必须保持通过。

---

### Task 1: content.ts 递归扫描 + category + getCategories

**Files:**
- Modify: `src/lib/types.ts`（WorkEntry 加 `category?: string`）
- Modify: `src/lib/content.ts`（scanMediaFiles 递归、src 含子目录、导出 getCategories、bare 条目填 category）
- Modify: `src/lib/content.test.ts`（补递归扫描 + getCategories 测试）

**Interfaces:**
- Produces（供 Task 2 使用）：
  - `WorkEntry.category?: string` — 完整相对路径，如 `"邦邦乐队/动画"`；根目录文件无此字段
  - `getCategories(): string[]` — 所有可选类别（含父级），去重、按路径排序

- [ ] **Step 1: 给 WorkEntry 加字段**

`src/lib/types.ts` 的 `WorkEntry` 接口加一行（放在 `tags: string[]` 之后）：
```ts
  category?: string
```

- [ ] **Step 2: 写失败测试**

`src/lib/content.test.ts`：先在文件顶部 import 行追加 `getCategories`（改为 `import { getAllWorks, getWork, getWorksByType, getFeaturedWorks, getCategories, invalidateCache } from './content'`），再在 `describe('content loader')` 内追加：

```ts
it('recursively scans subdirectories into category and src', () => {
  writeMedia('images/风景', 'mountain.png')
  writeMedia('images/邦邦乐队/动画', 'band.png')
  writeMedia('images', 'bare-root.png')
  createdMedia.push('images/风景/mountain.png', 'images/邦邦乐队/动画/band.png', 'images/bare-root.png')

  const works = testOnly(getAllWorks())
  const mountain = works.find(w => w.slug === 'mountain')
  const band = works.find(w => w.slug === 'band')
  const root = works.find(w => w.slug === 'bare-root')
  expect(mountain!.category).toBe('风景')
  expect(mountain!.src).toBe('/media/images/风景/mountain.png')
  expect(band!.category).toBe('邦邦乐队/动画')
  expect(root!.category).toBeUndefined()
})

it('getCategories includes parent paths, deduped and sorted', () => {
  writeMedia('images/邦邦乐队/动画', 'band.png')
  writeMedia('images/邦邦乐队', 'live.png')
  writeMedia('images/风景', 'mountain.png')
  createdMedia.push('images/邦邦乐队/动画/band.png', 'images/邦邦乐队/live.png', 'images/风景/mountain.png')

  const cats = getCategories()
  expect(cats).toContain('邦邦乐队')
  expect(cats).toContain('邦邦乐队/动画')
  expect(cats).toContain('风景')
  // sorted: 中文按 Unicode 码点，验证去重无重复
  expect(new Set(cats).size).toBe(cats.length)
})
```

- [ ] **Step 3: 运行测试确认失败**

Run: `npx vitest run src/lib/content.test.ts`
Expected: FAIL（`getCategories` 未导出 / category 未定义）

- [ ] **Step 4: 实现递归扫描 + category**

`src/lib/content.ts`：

(1) `RawMediaFile` 加字段：
```ts
interface RawMediaFile { slug: string; type: WorkType; src: string; category?: string }
```

(2) `scanMediaFiles` 改为递归（用一个内部递归函数，替换原 for 循环体）：
```ts
function scanMediaFiles(): RawMediaFile[] {
  if (!fs.existsSync(MEDIA_DIR)) return []
  const files: RawMediaFile[] = []
  for (const dir of SCAN_DIRS) {
    const dirPath = path.join(MEDIA_DIR, dir)
    if (!fs.existsSync(dirPath)) continue
    walkDir(dirPath, dir, '', files)
  }
  return files
}

function walkDir(dirPath: string, dir: ScanDir, category: string, files: RawMediaFile[]): void {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath, dir, category ? `${category}/${entry.name}` : entry.name, files)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (!(MEDIA_EXTENSIONS[dir] || []).includes(ext)) continue
      const slug = slugify(path.basename(entry.name, ext))
      const sub = category ? `${category}/` : ''
      files.push({ slug, type: dirToType(dir), src: `/media/${dir}/${sub}${entry.name}`, category: category || undefined })
    }
  }
}
```

(3) `buildWorksIndex` 的 bare 条目透传 category（在 index.push 对象里 `tags: []` 后加）：
```ts
      category: media.category,
```

(4) MDX 条目 category 从 src 派生（在 buildWorksIndex 的 MDX 循环里、`index.push(mdx)` 前加）：
```ts
    const cat = categoryFromSrc(mdx.src)
    if (cat) mdx.category = cat
```

(5) 新增 helper + 导出：
```ts
/** Derive category (relative path) from a media src like /media/{dir}/{subpath}. */
function categoryFromSrc(src: string): string | undefined {
  const parts = src.split('/').filter(Boolean) // ['media','images','邦邦乐队','动画']
  if (parts.length <= 3) return undefined // no subdir
  return parts.slice(2).join('/')
}

/** All selectable categories (including parent paths), deduped and sorted. */
export function getCategories(): string[] {
  const set = new Set<string>()
  for (const w of getIndex()) {
    const c = w.category ?? categoryFromSrc(w.src)
    if (!c) continue
    const parts = c.split('/')
    for (let i = 1; i <= parts.length; i++) set.add(parts.slice(0, i).join('/'))
  }
  return [...set].sort()
}
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run src/lib/content.test.ts`
Expected: PASS（原有 + 2 个新测试）

- [ ] **Step 6: 不 commit**

不改 git。

---

### Task 2: 公开画廊类别筛选 UI

**Files:**
- Create: `src/components/gallery/CategoryFilter.tsx`（client 受控按钮条）
- Create: `src/components/gallery/CategoryWorks.tsx`（client 容器：active 状态 + 过滤 + 网格）
- Modify: `src/app/works/page.tsx`（server：取数据，渲染 CategoryWorks）

**Interfaces:**
- Consumes: `getCategories()`（Task 1）、`WorkEntry`（含 category）、现有 `GalleryGrid`
- Produces: `<CategoryWorks works={WorkEntry[]} categories={string[]} />`

- [ ] **Step 1: 写 CategoryFilter（受控按钮条）**

`src/components/gallery/CategoryFilter.tsx`：

```tsx
'use client'

interface Props {
  categories: string[]
  active: string | null
  onSelect: (cat: string | null) => void
}

export default function CategoryFilter({ categories, active, onSelect }: Props) {
  const cls = (isActive: boolean) =>
    `px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-warm-700 text-warm-50' : 'bg-white text-warm-500 hover:bg-warm-100 border border-warm-200'}`
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <button onClick={() => onSelect(null)} className={cls(active === null)}>全部</button>
      {categories.map((c) => (
        <button key={c} onClick={() => onSelect(active === c ? null : c)} className={cls(active === c)}>{c}</button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: 写 CategoryWorks（容器：过滤 + 网格）**

`src/components/gallery/CategoryWorks.tsx`：

```tsx
'use client'

import { useState } from 'react'
import type { WorkEntry } from '@/lib/types'
import CategoryFilter from './CategoryFilter'
import GalleryGrid from './GalleryGrid'

export default function CategoryWorks({ works, categories }: { works: WorkEntry[]; categories: string[] }) {
  const [active, setActive] = useState<string | null>(null)
  const filtered = active
    ? works.filter((w) => w.category === active || w.category?.startsWith(active + '/'))
    : works
  return (
    <>
      <CategoryFilter categories={categories} active={active} onSelect={setActive} />
      <GalleryGrid works={filtered} />
    </>
  )
}
```

- [ ] **Step 3: 接入 works 页**

`src/app/works/page.tsx` 改为：

```tsx
import type { Metadata } from 'next'
import { getAllWorks, getCategories } from '@/lib/content'
import CategoryWorks from '@/components/gallery/CategoryWorks'

export const metadata: Metadata = {
  title: '作品 — Ser3nus Gallery',
}

export default function WorksPage() {
  const works = getAllWorks()
  const categories = getCategories()
  return (
    <>
      <h1 className="font-serif text-3xl text-warm-800 mb-8 text-center">全部作品</h1>
      <CategoryWorks works={works} categories={categories} />
    </>
  )
}
```

- [ ] **Step 4: 类型检查 + 构建**

Run: `npx tsc --noEmit`
Expected: PASS

Run: `npm run build`
Expected: 成功，`/works` 路由正常

- [ ] **Step 5: 不 commit**

不改 git。

---

### Task 3: 私密加密脚本递归 + manifest category

**Files:**
- Modify: `scripts/encrypt-private.ts`

**Interfaces:**
- Consumes: 现有 slugify、deriveKey/encryptBytes/bytesToBase64（均已存在）
- Produces: `manifest.json` 每项含 `category`；密文仍平铺 `public/media/private/`，重复 slug 追加序号后缀保证唯一

- [ ] **Step 1: 改脚本为递归扫描 + slug 去重**

`scripts/encrypt-private.ts`：将原 `for (const entry of fs.readdirSync(SRC_DIR, ...))` 平铺循环替换为递归遍历，并跟踪已用 slug：

```ts
const usedSlugs = new Set<string>()
const images: { slug: string; file: string; category?: string }[] = []

function uniqueSlug(base: string): string {
  let slug = base
  let i = 2
  while (usedSlugs.has(slug)) { slug = `${base}-${i}`; i++ }
  usedSlugs.add(slug)
  return slug
}

function encryptDir(dirPath: string, category: string): void {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      encryptDir(full, category ? `${category}/${entry.name}` : entry.name)
    } else if (entry.isFile()) {
      const bytes = new Uint8Array(fs.readFileSync(full))
      const { iv, ciphertext } = await encryptBytes(key, bytes)
      const slug = uniqueSlug(slugify(entry.name))
      const file = `${slug}.enc.json`
      fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify({ iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) }))
      images.push({ slug, file, category: category || undefined })
      console.log(`✓ encrypted ${entry.name} -> ${file}${category ? ` (${category})` : ''}`)
    }
  }
}

encryptDir(SRC_DIR, '')
```

（`encryptBytes(key, ...)` 需要 `await`，保持脚本顶层 await 的既有写法。将原循环体整体移入 `encryptDir`。）

- [ ] **Step 2: 端到端验证**

Run:
```bash
mkdir -p private-src/邦邦乐队/动画
cp public/media/images/anima_base_v1_0-none-artistmixer_00001_.png private-src/邦邦乐队/动画/demo.png
cp public/media/images/anima_base_v1_0-none-artistmixer_00001_.png private-src/demo.png   # 同名，验证去重
printf 'testpass123\n' | npm run encrypt-private
node -e "const m=require('./public/media/private/manifest.json'); console.log(JSON.stringify(m.images,null,1))"
```
Expected: manifest 有 2 项——`demo`（category `邦邦乐队/动画`）和 `demo-2`（无 category），slug 不冲突。随后：
```bash
rm -rf private-src public/media/private
```
Expected: 无残留。

- [ ] **Step 3: 不 commit**

不改 git。

---

### Task 4: 私密画廊类别筛选

**Files:**
- Modify: `src/components/private/usePrivateImages.ts`（PrivateImage 加 category，从 manifest 读取）
- Modify: `src/components/private/PrivateGallery.tsx`（解锁后收集类别 + 渲染 CategoryFilter + 过滤）

**Interfaces:**
- Consumes: `CategoryFilter`（Task 2）、`PrivateImage`（加 category）、manifest category（Task 3）
- Produces: 私密画廊解锁后按类别筛选

- [ ] **Step 1: usePrivateImages 读取 category**

`src/components/private/usePrivateImages.ts`：
- `interface ManifestImage { slug: string; file: string; category?: string }`
- `export interface PrivateImage { slug: string; title: string; url: string; category?: string }`
- 解密循环里 push 时带上 `category: img.category`：
```ts
        urls.push({ slug: img.slug, title: titleFromSlug(img.slug), url: URL.createObjectURL(blob), category: img.category })
```

- [ ] **Step 2: PrivateGallery 接入类别筛选**

`src/components/private/PrivateGallery.tsx`：
- import `CategoryFilter` from '@/components/gallery/CategoryFilter'
- 加 `const [activeCat, setActiveCat] = useState<string | null>(null)`
- 收集类别（在 images 有值时）：
```ts
  const categories = Array.from(new Set(images.flatMap((img) => {
    const c = img.category
    if (!c) return []
    const parts = c.split('/')
    return Array.from({ length: parts.length }, (_, i) => parts.slice(0, i + 1).join('/'))
  }))).sort()
```
- 过滤网格：
```tsx
      {status === 'unlocked' && (
        <>
          {categories.length > 0 && (
            <CategoryFilter categories={categories} active={activeCat} onSelect={setActiveCat} />
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.filter((img) => !activeCat || img.category === activeCat || img.category?.startsWith(activeCat + '/'))
              .map((img) => <PrivateCard key={img.slug} image={img} onOpen={setOpen} />)}
          </div>
        </>
      )}
```

- [ ] **Step 3: 类型检查 + 构建**

Run: `npx tsc --noEmit`
Expected: PASS

Run: `npm run build`
Expected: 成功，`/private` 仍存在

- [ ] **Step 4: 不 commit**

不改 git。

---

### Task 5: 端到端验证 + 全量测试

**Files:**
- 无代码改动

- [ ] **Step 1: 私密加密 + /private 验证**

Run:
```bash
mkdir -p private-src/类别A
cp public/media/images/anima_base_v1_0-none-artistmixer_00001_.png private-src/类别A/a.png
printf 'testpass123\n' | npm run encrypt-private
npx next dev --port 3097 &
sleep 8
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3097/private
kill %1 2>/dev/null
rm -rf private-src public/media/private
```
Expected: /private 200；manifest 含 category。

- [ ] **Step 2: 公开侧验证**

Run: `npx vitest run && npm run build`
Expected: 全部测试通过（含 Task 1 新测试），构建成功。

- [ ] **Step 3: 通知用户放行**

> 改动留在工作区。用户放行后：整理公开图片进类别子目录、重跑私密加密、commit + push 部署。
