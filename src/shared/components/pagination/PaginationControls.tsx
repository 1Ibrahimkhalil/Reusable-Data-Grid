import { useId } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

const DEFAULT_PAGE_SIZE_OPTIONS: readonly number[] = [5, 10, 25, 50, 100]

export interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: readonly number[]
  onPrevious: () => void
  onNext: () => void
  onPageSizeChange: (pageSize: number) => void
  canGoPrevious: boolean
  canGoNext: boolean
  className?: string
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPrevious,
  onNext,
  onPageSizeChange,
  canGoPrevious,
  canGoNext,
  className,
}: PaginationControlsProps) {
  const pageSizeId = useId()

  return (
    <div
      className={cn(
        'flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-5',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canGoPrevious}
            onClick={onPrevious}
            aria-label="Previous page"
          >
            <ChevronLeft aria-hidden="true" />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canGoNext}
            onClick={onNext}
            aria-label="Next page"
          >
            Next
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
        <span aria-live="polite" className="whitespace-nowrap tabular-nums">
          Page {currentPage} of {totalPages} &middot; {totalItems} results
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={pageSizeId} className="text-xs font-medium whitespace-nowrap">
          Rows per page
        </label>
        <select
          id={pageSizeId}
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
