import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { DATA_GRID_TABLE_CLASS_NAME } from './constants'

export interface DataGridSkeletonProps {
  rows?: number
  columns?: number
  showFilters?: boolean
  label?: string
  className?: string
}

export function DataGridSkeleton({
  rows = 10,
  columns = 8,
  showFilters = false,
  label = 'Loading data',
  className,
}: DataGridSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn('relative min-w-0 overflow-x-auto rounded-lg border border-border', className)}
    >
      <span className="sr-only">{label}</span>
      <table aria-hidden="true" className={DATA_GRID_TABLE_CLASS_NAME}>
        <thead>
          <tr className="border-b border-border bg-muted/60">
            {Array.from({ length: columns }, (_, columnIndex) => (
              <th key={columnIndex} className="px-2 py-2.5 text-left sm:px-3">
                <Skeleton className="h-3.5 w-16" />
              </th>
            ))}
          </tr>
          {showFilters ? (
            <tr className="border-b border-border bg-muted/40">
              {Array.from({ length: columns }, (_, columnIndex) => (
                <td key={columnIndex} className="px-2 py-2 sm:px-3">
                  <Skeleton className="h-8 w-full" />
                </td>
              ))}
            </tr>
          ) : null}
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/70 last:border-b-0">
              {Array.from({ length: columns }, (_, columnIndex) => (
                <td key={columnIndex} className="px-2 py-2.5 sm:px-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
