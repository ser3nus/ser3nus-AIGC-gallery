'use client'

export default function AudioPlayer({ src }: { src: string }) {
  return (
    <div className="rounded-xl bg-warm-100 p-8 flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-full bg-warm-200 flex items-center justify-center text-4xl">🎵</div>
      <audio controls className="w-full max-w-md" preload="metadata">
        <source src={src} />
        <p>您的浏览器不支持此音频格式。<a href={src} download className="underline">下载音频</a></p>
      </audio>
    </div>
  )
}
