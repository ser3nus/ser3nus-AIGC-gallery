'use client'

import { useMemo } from 'react'

interface Props {
  categories: string[]     // flat paths like "邦邦乐队/动画", "Viola/mast"
  active: string | null    // current filter path, null = all
  onSelect: (cat: string | null) => void
}

/** Build a tree { name, fullPath, children } from flat slash-delimited paths. */
interface Node { name: string; fullPath: string; children: Node[] }
function buildTree(paths: string[]): Node[] {
  const root: Node[] = []
  for (const p of paths) {
    const parts = p.split('/')
    let level = root
    for (let i = 0; i < parts.length; i++) {
      const prefix = parts.slice(0, i + 1).join('/')
      let node = level.find((n) => n.fullPath === prefix)
      if (!node) {
        node = { name: parts[i], fullPath: prefix, children: [] }
        level.push(node)
      }
      level = node.children
    }
  }
  return root
}

export default function CategoryFilter({ categories, active, onSelect }: Props) {
  const tree = useMemo(() => buildTree(categories), [categories])

  // Determine which level of the tree we're showing
  // active=null → root; active="Viola" → Viola's children; active="Viola/mast" → deeper
  const parts = active ? active.split('/') : []
  let currentNode = tree
  for (let i = 0; i < parts.length; i++) {
    const found = currentNode.find((n) => n.name === parts[i])
    if (found) currentNode = found.children
    else break
  }

  const parentName = parts.length > 0 ? parts[parts.length - 1] : null
  const parentPath = parts.length > 0 ? active : null

  const btn = (isActive: boolean) =>
    `px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-warm-700 text-warm-50' : 'bg-white text-warm-500 hover:bg-warm-100 border border-warm-200'}`

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {/* Back button: goes up one level, selects parent */}
      {parentName && (
        <button
          onClick={() => {
            const up = active!.split('/').slice(0, -1).join('/')
            onSelect(up || null)
          }}
          className={btn(false)}
        >
          ← 返回
        </button>
      )}

      {/* "全部" — levels up to root when drilled in, or clears filter at top */}
      <button onClick={() => onSelect(parentPath)} className={btn(active === parentPath)}>
        {parentName ? '全部' : '全部'}
      </button>

      {/* Direct subcategories */}
      {currentNode.map((n) => (
        <button
          key={n.fullPath}
          onClick={() => onSelect(n.fullPath)}
          className={btn(active === n.fullPath)}
        >
          {n.name}
          {n.children.length > 0 && ' ▸'}
        </button>
      ))}
    </div>
  )
}
