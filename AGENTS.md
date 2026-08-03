<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ser3nus AIGC Gallery

Personal gallery of AI-generated media (image/video/audio/text). Next.js 16 App Router + React 19 + TypeScript + Tailwind v4, statically exported to GitHub Pages (`output: 'export'`, `basePath: '/ser3nus-AIGC-gallery'`, images unoptimized). Entry: `src/app/layout.tsx`.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — static export to `out/` (uses `next build`; `npm test` first in CI)
- `npm run start` — serve production build
- `npm test` / `npm run test:watch` — vitest (jsdom, globals on)
- `npx tsc --noEmit` — typecheck (CI)
- Lint: `npm run lint` is **broken** — `next lint` was removed in Next 16. Use `node node_modules/eslint/bin/eslint.js src` (or `npx eslint src`; plain `npx.cmd eslint` segfaults on this Windows box). There are pre-existing errors (`react/no-unescaped-entities` in WorkCard.tsx / PromptCard.tsx) and a warning in `src/app/layout.tsx`; fix new ones, don't add more.
- `npm run deploy` — run `scripts/deploy.mjs`: rebuilds `out/`, adds `.nojekyll`, then force-pushes a fresh `gh-pages` branch (SSH `git@github.com:ser3nus/ser3nus-AIGC-gallery.git`). Replaces the `gh-pages` npm package, whose cache (`node_modules/.cache/gh-pages`) got pushed to the remote and caused stale/inconsistent deploys (404s after adding images). GitHub Actions (`deploy.yml`) exists but Pages source is the legacy `gh-pages` branch, so pushes to `main` do NOT deploy.

## Architecture

- `src/app/` — App Router pages: `/` (HeroBanner + background), `/works` (grid + FilterBar + SearchInput), `/works/[slug]` (detail + prev/next), `/category/[type]`, `/about`, `not-found`. All static: `generateStaticParams` + `generateMetadata`; `params` is a Promise.
- `src/lib/content.ts` — build-time work index: scans `public/media/{images,videos,audio,text,banner,background}/` for bare entries + `content/works/{type}/*.mdx` for frontmatter-rich entries; dedupes by slug (priority images > banner > background > videos > audio > text); featured entries with missing src throw at build. 5s TTL cache + `invalidateCache()`.
- `src/lib/schema.ts` — zod `workEntrySchema` validating MDX frontmatter (thumbnail required for non-text types).
- `src/lib/paths.ts` — `assetPath()` prefixes the `/ser3nus-AIGC-gallery` basePath onto public URLs.
- `src/components/` — `gallery/` (HeroBanner, GalleryGrid, WorkCard, FilterBar), `viewer/` (MediaViewer + type-specific players), `meta/` (MetaPanel, PromptCard, ParamTable, ModelTag, TagCloud), `ui/` (Header, Footer, SearchInput, EmptyState).
- Content sources: `content/works/{type}/*.mdx` (gray-matter frontmatter + body = description) and `public/media/{type}/` (bare files). `banner/` drives the homepage carousel, `background/` the page background.

## Conventions

- Path alias `@/` → `src/`. No default exports in lib files; pages export named/default as the framework requires.
- Slugs: lowercase alphanumeric + hyphens (`/^[a-z0-9-]+$/`); `slugify()` hashes non-ASCII filenames to `work-<hash>`.
- To add a work: drop a file into `public/media/<type>/`; optionally add frontmatter via `content/works/<type>/<slug>.mdx` (validated by `workEntrySchema`; invalid frontmatter logs to console and is skipped).
- Tailwind v4 utility classes; `warm-*` palette tokens, `font-serif` (Playfair Display) for headings, `font-sans` (Inter) for body.
- Tests live in `src/lib/*.test.ts` (vitest + @testing-library); they create and clean up real files under `public/media/` and `content/works/`, so don't run them against a dev server actively reading content.
- Follow `node_modules/next/dist/docs/` for this Next.js version — it has breaking differences from stock Next.js docs.

## Notes

- (add quick notes here)
