export default function ModelTag({ model }: { model: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-warm-100 text-warm-600">
      <span className="text-xs">🤖</span> {model}
    </span>
  )
}
