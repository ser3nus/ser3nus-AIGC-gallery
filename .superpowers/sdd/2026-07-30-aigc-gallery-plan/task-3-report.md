# Task 3 Report: Content Loader (Core Engine)

## 1. Status: DONE

## 2. Commits

```
3298be4 feat: implement content loader with dual-layer merge logic
```

## 3. Test Summary

```
 RUN  v4.1.10

 ✓ src/lib/content.test.ts (9 tests | 9 passed)

   ✓ returns an empty index when no files exist
   ✓ creates bare entries for media files without .mdx metadata
   ✓ loads full entries from .mdx frontmatter
   ✓ prefers .mdx metadata over bare media entry for same slug
   ✓ getAllWorks returns all entries (bare + metadata)
   ✓ getWork returns undefined for unknown slug
   ✓ getWorksByType filters correctly
   ✓ getFeaturedWorks returns only featured entries
   ✓ handles different media types in correct subdirs

 ✓ src/lib/schema.test.ts (7 tests | 7 passed) — no regressions
```

All 16 tests pass (9 new + 7 existing schema tests).

## 4. Files

- `src/lib/content.ts` — Content loader with four exported functions (`getAllWorks`, `getWork`, `getWorksByType`, `getFeaturedWorks`) plus `invalidateCache` for testing
- `src/lib/content.test.ts` — 9 tests covering empty state, bare entries, .mdx merge, type filtering, featured filtering, and cross-type handling
- `.superpowers/sdd/2026-07-30-aigc-gallery-plan/task-3-brief.md` — Task specification with reference implementation and tests

## 5. Concerns

- **YAML Date coercion**: YAML parses values like `date: 2026-07-15` as `Date` objects rather than strings. The Zod schema expects `z.string()`, so a `Date` object causes validation failure. Fixed in `scanMdxFiles()` by converting any `instanceof Date` values to ISO date strings (`value.toISOString().split('T')[0]`). Also updated the test helper `writeMdx` to quote all string values in YAML output to prevent type coercion. Both layers of defense are important — the code fix handles real-world .mdx files, and the test fix keeps test YAML portably correct.
- **Cache strategy**: Module-level cache with `invalidateCache()` exported for test use. Each test calls `invalidateCache()` in `beforeEach` to ensure a clean state. This is acceptable for Node.js server contexts; for edge runtimes, a stateless approach would be needed.
- **Cleanup**: `afterAll` removes all test-created files from `public/media/` and `content/works/`. The `beforeEach` also cleans up from any previous failed test. Verified no leftover test artifacts.
- **Directory naming**: The media subdirectories use plural names (`images`, `videos`, `audio`, `text`), which matches the scaffolded directory structure. The type mapping is explicit in `MEDIA_DIRS` — no implicit derivation from directory names.
