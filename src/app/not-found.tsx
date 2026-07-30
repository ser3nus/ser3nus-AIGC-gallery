import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <h1 className="font-serif text-6xl text-warm-300 mb-4">404</h1>
      <p className="text-warm-500 mb-8">作品未找到</p>
      <Link href="/" className="text-sm text-warm-600 hover:text-warm-800 underline underline-offset-4 transition-colors">返回首页</Link>
    </div>
  )
}
