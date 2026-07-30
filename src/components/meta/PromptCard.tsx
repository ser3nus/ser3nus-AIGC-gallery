'use client'

import { useState } from 'react'

export default function PromptCard({ prompt, negativePrompt }: { prompt: string; negativePrompt?: string }) {
  const [copied, setCopied] = useState(false)

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg border border-warm-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg text-warm-800">提示词</h3>
        <button onClick={copyPrompt} className="text-xs px-3 py-1 rounded-full bg-warm-100 text-warm-500 hover:bg-warm-200 transition-colors">
          {copied ? '✓ 已复制' : '复制'}
        </button>
      </div>
      <p className="text-sm text-warm-700 leading-relaxed italic">"{prompt}"</p>
      {negativePrompt && (
        <div className="mt-3 pt-3 border-t border-warm-100">
          <p className="text-xs text-warm-400 mb-1">反向提示词</p>
          <p className="text-sm text-warm-500 italic">"{negativePrompt}"</p>
        </div>
      )}
    </div>
  )
}
