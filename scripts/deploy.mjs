#!/usr/bin/env node
// Reliable GitHub Pages deploy.
//
// Replaces the `gh-pages` npm package, which had a cache bug: its working dir
// `node_modules/.cache/gh-pages` (full build snapshots) got pushed to the remote
// gh-pages branch, and incremental deploys could leave the live site stale or
// inconsistent (index.html updated but new detail pages missing → 404).
//
// This script snapshots out/ and force-pushes it as a fresh gh-pages branch each
// time, so the remote always matches the local build exactly — no cache, no
// leftover files.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'out')
const remote = 'git@github.com:ser3nus/ser3nus-AIGC-gallery.git'

function run(cmd, cwd) {
  console.log(`> ${cmd}`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

// 1. Rebuild the static export
run('npm run build', root)

// 2. .nojekyll stops GitHub Pages from running Jekyll over `_next/`
fs.writeFileSync(path.join(outDir, '.nojekyll'), '')

// 3. Fresh git repo from the out/ snapshot (no cache, no stray files)
fs.rmSync(path.join(outDir, '.git'), { recursive: true, force: true })
run('git init -q', outDir)
run('git checkout -b gh-pages', outDir)
run('git add -A', outDir)
run('git config user.email deploy@localhost', outDir)
run('git config user.name deploy', outDir)
run('git commit -q -m "deploy"', outDir)

// 4. Force push replaces the branch with this exact snapshot
run(`git push -f ${remote} gh-pages`, outDir)

console.log('✅ Deployed: https://ser3nus.github.io/ser3nus-AIGC-gallery/')
