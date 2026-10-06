import { useId } from 'react'

import { cn } from '@/shared/lib/utils'

export interface SelectColumnFilterProps {
  header: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  labelHidden?: boolean
  className?: string
}

export function SelectColumnFilter({
  header,
  value,
  onChange,
  options,
  labelHidden = false,
  className,
}: SelectColumnFilterProps) {
  const selectId = useId()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={selectId}
        className={cn('text-xs font-medium text-muted-foreground', labelHidden && 'sr-only')}
      >
        {header}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full min-w-[6rem] max-w-44 rounded-lg border border-input bg-background px-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      >
        <option value="">All {header}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
