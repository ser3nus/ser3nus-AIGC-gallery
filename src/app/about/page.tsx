import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '说明 — Ser3nus Gallery',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="font-serif text-3xl text-warm-800 mb-8 text-center">说明</h1>

      <div className="space-y-6 text-warm-700 leading-relaxed">
        <section className="bg-white rounded-xl border border-warm-200 p-6">
          <h2 className="font-serif text-xl text-warm-800 mb-3">关于本站</h2>
          <p>Ser3nus AIGC Gallery 是一个个人 AI 生成作品展示网站，用于陈列通过各类 AI 工具创作的媒体内容。</p>
        </section>

        <section className="bg-white rounded-xl border border-warm-200 p-6">
          <h2 className="font-serif text-xl text-warm-800 mb-3">如何添加作品</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>将媒体文件（图片/视频/音频/文本）放入 <code className="bg-warm-100 px-1.5 py-0.5 rounded text-xs font-mono">public/media/</code> 对应子目录</li>
            <li>文件会立即出现在「作品」页面中（自动发现模式）</li>
            <li>如需添加提示词、模型等元信息，在 <code className="bg-warm-100 px-1.5 py-0.5 rounded text-xs font-mono">content/works/</code> 下创建同名 <code className="bg-warm-100 px-1.5 py-0.5 rounded text-xs font-mono">.mdx</code> 文件</li>
          </ol>
        </section>

        <section className="bg-white rounded-xl border border-warm-200 p-6">
          <h2 className="font-serif text-xl text-warm-800 mb-3">技术栈</h2>
          <p className="text-sm">React · Next.js (App Router) · TypeScript · Tailwind CSS · Zod · MDX</p>
        </section>
      </div>
    </div>
  )
}
