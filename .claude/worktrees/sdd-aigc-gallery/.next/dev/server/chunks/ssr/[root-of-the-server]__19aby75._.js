module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/lib/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateWorkEntry",
    ()=>validateWorkEntry,
    "workEntrySchema",
    ()=>workEntrySchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const slugRegex = /^[a-z0-9-]+$/;
const parametersSchema = __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional();
const workEntrySchema = __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    slug: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(slugRegex, 'slug must be lowercase alphanumeric with hyphens'),
    title: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    type: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'image',
        'video',
        'audio',
        'text'
    ]),
    date: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    src: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    thumbnail: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    category: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    model: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().default(null),
    prompt: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().default(null),
    negativePrompt: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    parameters: parametersSchema,
    seed: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    generatedAt: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    featured: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([])
}).superRefine((data, ctx)=>{
    // Thumbnail is required for visual types (image, video, audio)
    if (data.type !== 'text' && !data.thumbnail) {
        ctx.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
            path: [
                'thumbnail'
            ],
            message: 'Thumbnail is required for image, video, and audio types'
        });
    }
});
function validateWorkEntry(frontmatter) {
    return workEntrySchema.parse(frontmatter);
}
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/lib/content.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllWorks",
    ()=>getAllWorks,
    "getFeaturedWorks",
    ()=>getFeaturedWorks,
    "getWork",
    ()=>getWork,
    "getWorksByType",
    ()=>getWorksByType,
    "invalidateCache",
    ()=>invalidateCache
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gray$2d$matter$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gray-matter/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/src/lib/schema.ts [app-rsc] (ecmascript)");
;
;
;
;
const MEDIA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'media');
const CONTENT_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'content', 'works');
const MEDIA_EXTENSIONS = {
    images: [
        '.png',
        '.jpg',
        '.jpeg',
        '.webp',
        '.avif',
        '.gif',
        '.svg'
    ],
    videos: [
        '.mp4',
        '.webm',
        '.mov'
    ],
    audio: [
        '.mp3',
        '.wav',
        '.ogg',
        '.flac'
    ],
    text: [
        '.md',
        '.txt'
    ]
};
const SCAN_DIRS = [
    'images',
    'videos',
    'audio',
    'text'
];
function dirToType(dir) {
    const map = {
        images: 'image',
        videos: 'video',
        audio: 'audio',
        text: 'text'
    };
    return map[dir];
}
function scanMediaFiles() {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(MEDIA_DIR)) return [];
    const files = [];
    for (const dir of SCAN_DIRS){
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(MEDIA_DIR, dir);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dirPath)) continue;
        for (const entry of __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(dirPath, {
            withFileTypes: true
        })){
            if (!entry.isFile()) continue;
            if (entry.name.startsWith('.')) continue;
            const ext = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].extname(entry.name).toLowerCase();
            if (!(MEDIA_EXTENSIONS[dir] || []).includes(ext)) continue;
            const slug = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(entry.name, ext);
            files.push({
                slug,
                type: dirToType(dir),
                src: `/media/${dir}/${entry.name}`
            });
        }
    }
    return files;
}
function scanMdxFiles() {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(CONTENT_DIR)) return [];
    const works = [];
    for (const dir of SCAN_DIRS){
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(CONTENT_DIR, dir);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dirPath)) continue;
        for (const entry of __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(dirPath, {
            withFileTypes: true
        })){
            if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
            if (entry.name.startsWith('.')) continue;
            const slug = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(entry.name, '.mdx');
            const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dirPath, entry.name);
            const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(fullPath, 'utf-8');
            const { data, content } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gray$2d$matter$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(raw);
            // YAML parses date-like strings as Date objects; convert back to string
            const cleaned = {};
            for (const [key, value] of Object.entries(data)){
                cleaned[key] = value instanceof Date ? value.toISOString().split('T')[0] : value;
            }
            const parsed = __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workEntrySchema"].safeParse({
                ...cleaned,
                slug
            });
            if (parsed.success) {
                works.push({
                    ...parsed.data,
                    description: content?.trim() || undefined,
                    isBare: false
                });
            } else {
                console.error(`[content] Invalid frontmatter in ${fullPath}:`, parsed.error.issues);
            }
        }
    }
    return works;
}
function buildWorksIndex() {
    const mediaFiles = scanMediaFiles();
    const mdxWorks = scanMdxFiles();
    const mdxSlugs = new Set(mdxWorks.map((w)=>w.slug));
    const index = [
        ...mdxWorks
    ];
    for (const mediaFile of mediaFiles){
        if (!mdxSlugs.has(mediaFile.slug)) {
            index.push({
                slug: mediaFile.slug,
                title: mediaFile.slug.replace(/-/g, ' ').replace(/\b\w/g, (c)=>c.toUpperCase()),
                type: mediaFile.type,
                date: new Date().toISOString().split('T')[0],
                src: mediaFile.src,
                model: null,
                prompt: null,
                featured: false,
                tags: [],
                isBare: true
            });
        }
    }
    // Check featured works have valid files
    for (const w of index.filter((w)=>w.featured)){
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', w.src);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(filePath)) {
            throw new Error(`[content] Featured work "${w.slug}" has missing src: ${w.src}`);
        }
    }
    // Check for duplicate slugs
    const slugs = new Set();
    for (const w of index){
        if (slugs.has(w.slug)) throw new Error(`[content] Duplicate slug: "${w.slug}"`);
        slugs.add(w.slug);
    }
    index.sort((a, b)=>b.date.localeCompare(a.date));
    return index;
}
function invalidateCache() {}
function getIndex() {
    // Always scan fresh so new files appear immediately without restart
    return buildWorksIndex();
}
function getAllWorks() {
    return [
        ...getIndex()
    ];
}
function getWork(slug) {
    return getIndex().find((w)=>w.slug === slug) ?? null;
}
function getWorksByType(type) {
    return getIndex().filter((w)=>w.type === type);
}
function getFeaturedWorks() {
    return getIndex().filter((w)=>w.featured);
}
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx <module evaluation>", "default");
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx", "default");
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/src/lib/content.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/SearchInput.tsx [app-rsc] (ecmascript)");
;
;
;
;
const NAV_ITEMS = [
    {
        label: '主页',
        href: '/'
    },
    {
        label: '作品',
        href: '/works'
    },
    {
        label: '说明',
        href: '/about'
    }
];
function Header() {
    const works = (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllWorks"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 bg-warm-50/90 backdrop-blur border-b border-warm-200",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "font-serif text-2xl tracking-wide text-warm-800 hover:text-warm-600 transition-colors",
                    children: "Ser3nus Gallery"
                }, void 0, false, {
                    fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "flex gap-6 text-sm tracking-widest uppercase",
                            children: NAV_ITEMS.map(({ label, href })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        href: href,
                                        className: "text-warm-500 hover:text-warm-800 transition-colors",
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx",
                                        lineNumber: 24,
                                        columnNumber: 17
                                    }, this)
                                }, href, false, {
                                    fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx",
                                    lineNumber: 23,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            works: works
                        }, void 0, false, {
                            fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Footer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "border-t border-warm-200 mt-24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-6 py-8 text-center text-sm text-warm-400",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "© ",
                    new Date().getFullYear(),
                    " Ser3nus AIGC Gallery. All works generated with AI."
                ]
            }, void 0, true, {
                fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Footer.tsx",
                lineNumber: 5,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Footer.tsx",
            lineNumber: 4,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Footer.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/src/components/ui/Footer.tsx [app-rsc] (ecmascript)");
;
;
;
;
const metadata = {
    title: 'Ser3nus AIGC Gallery',
    description: 'A personal gallery of AI-generated media — images, videos, audio, and text.'
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "zh-CN",
        className: "h-full antialiased",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.googleapis.com"
                    }, void 0, false, {
                        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.gstatic.com",
                        crossOrigin: "anonymous"
                    }, void 0, false, {
                        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                className: "min-h-full flex flex-col bg-warm-50 text-warm-900 font-sans",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 max-w-7xl mx-auto w-full px-6 py-12",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f2e$claude$2f$worktrees$2f$sdd$2d$aigc$2d$gallery$2f$src$2f$components$2f$ui$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/.claude/worktrees/sdd-aigc-gallery/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__19aby75._.js.map