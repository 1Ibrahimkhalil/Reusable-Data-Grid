import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface EmptyStateProps {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title = 'No data',
  description = 'There is nothing to display yet.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Inbox aria-hidden="true" className="size-5 text-muted-foreground" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold">{title}</p>
        <p className="max-w-sm break-words text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}