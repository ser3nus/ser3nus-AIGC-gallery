'use client'

export default function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="rounded-xl overflow-hidden bg-warm-900">
      <video controls className="w-full max-h-[70vh]" playsInline preload="metadata">
        <source src={src} />
        <p>您的浏览器不支持此视频格式。<a href={src} download className="underline">下载视频</a></p>
      </video>
    </div>
  )
}
