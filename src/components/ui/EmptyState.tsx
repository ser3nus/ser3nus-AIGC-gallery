import Link from 'next/link'

interface EmptyStateProps {
  message: string
  actionLabel?: string
  actionHref?: string
}

export default function EmptyState({ message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-xl text-warm-400 italic mb-6">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="text-sm text-warm-500 hover:text-warm-700 underline underline-offset-4 transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
