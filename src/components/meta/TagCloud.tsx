export default function TagCloud({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="text-xs px-2 py-1 rounded bg-warm-100 text-warm-500">#{tag}</span>
      ))}
    </div>
  )
}
