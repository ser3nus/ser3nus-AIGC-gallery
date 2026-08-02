import type { Metadata } from 'next'
import TocNav from './TocNav'

export const metadata: Metadata = {
  title: '说明 — Ser3nus Gallery',
}

const SECTIONS = [
  { id: 'about', title: '关于本站' },
  { id: 'method', title: '创作方法' },
  { id: 'stack', title: '技术栈' },
]

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 flex gap-10">
      {/* Sidebar ToC */}
      <TocNav sections={SECTIONS} />

      {/* Main content */}
      <article className="flex-1 min-w-0 text-warm-700 leading-relaxed space-y-10 scroll-smooth">
        <h1 className="font-serif text-3xl text-warm-800 mb-8">说明</h1>

        <section id="about">
          <h2 className="font-serif text-xl text-warm-800 mb-3">关于本站</h2>
          <p>Ser3nus AIGC Gallery 是一个个人向 AIGC 作品展示网站。</p>
        </section>

        <section id="method">
          <h2 className="font-serif text-xl text-warm-800 mb-3">创作方法</h2>
          <p className="leading-relaxed">
            目前本站展示的作品均基于 <strong className="font-medium text-warm-800">anima-base 文生图模型</strong> 生成，搭配使用社区 lora 和 comfyui 节点。
            除极少数初始作品，几乎所有提示词、参数及工作流都是 agent 在理解本人提供的粗略意图指示后生成的（使用 Claude Code，连接 deepseek API，并配置若干相关 skill）。
            部分作品在 AIGC 的基础上，由本人使用 sai、photoshop 等编辑软件手动修改优化细节。
          </p>
        </section>

        <section id="stack">
          <h2 className="font-serif text-xl text-warm-800 mb-3">技术栈</h2>
          <p>React · Next.js (App Router) · TypeScript · Tailwind CSS · Zod · MDX</p>
        </section>
      </article>
    </div>
  )
}
