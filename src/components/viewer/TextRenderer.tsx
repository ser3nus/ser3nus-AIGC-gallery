import fs from 'fs'
import path from 'path'

async function getTextContent(src: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'public', src)
  if (!fs.existsSync(filePath)) return ''
  return fs.readFileSync(filePath, 'utf-8')
}

export default async function TextRenderer({ src, description }: { src: string; description?: string }) {
  const content = await getTextContent(src)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-warm-200 p-8 shadow-sm">
        <pre className="font-serif text-warm-800 whitespace-pre-wrap text-lg leading-relaxed">
          {content || description || '文件内容为空'}
        </pre>
      </div>
    </div>
  )
}
