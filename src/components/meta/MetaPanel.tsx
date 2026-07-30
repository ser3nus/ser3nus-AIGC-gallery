import type { WorkEntry } from '@/lib/types'
import PromptCard from './PromptCard'
import ModelTag from './ModelTag'
import ParamTable from './ParamTable'
import TagCloud from './TagCloud'

export default function MetaPanel({ work }: { work: WorkEntry }) {
  if (work.isBare) {
    return (
      <div className="space-y-6 mt-8 max-w-2xl mx-auto">
        <div className="text-center py-8 text-warm-400 italic">
          暂无元信息
          <p className="text-xs mt-2">创建 content/works/{work.type}s/{work.slug}.mdx 文件以添加 AIGC 元信息</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-8 max-w-2xl mx-auto">
      {work.prompt && <PromptCard prompt={work.prompt} negativePrompt={work.negativePrompt} />}
      <div className="flex flex-wrap gap-3">
        {work.model && <ModelTag model={work.model} />}
        {work.seed && <span className="text-xs px-3 py-1.5 rounded-full bg-warm-100 text-warm-500 font-mono">Seed: {work.seed}</span>}
        {work.generatedAt && <span className="text-xs px-3 py-1.5 rounded-full bg-warm-100 text-warm-500">生成于 {work.generatedAt}</span>}
      </div>
      {work.parameters && Object.keys(work.parameters).length > 0 && <ParamTable params={work.parameters} />}
      <TagCloud tags={work.tags} />
      {work.description && (
        <div className="bg-white rounded-lg border border-warm-200 p-6">
          <h3 className="font-serif text-lg text-warm-800 mb-3">作品描述</h3>
          <p className="text-sm text-warm-700 leading-relaxed">{work.description}</p>
        </div>
      )}
    </div>
  )
}
