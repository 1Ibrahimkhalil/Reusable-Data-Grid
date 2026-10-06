import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface ErrorStateProps {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'The data could not be loaded. Please try again.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
        <TriangleAlert aria-hidden="true" className="size-5 text-destructive" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold">{title}</p>
        <p className="max-w-sm break-words text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}