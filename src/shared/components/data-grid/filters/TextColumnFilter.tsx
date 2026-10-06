import { useId } from 'react'

import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'

export interface TextColumnFilterProps {
  header: string
  value: string
  onChange: (value: string) => void
  labelHidden?: boolean
  className?: string
}

export function TextColumnFilter({
  header,
  value,
  onChange,
  labelHidden = false,
  className,
}: TextColumnFilterProps) {
  const inputId = useId()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className={cn('text-xs font-medium text-muted-foreground', labelHidden && 'sr-only')}
      >
        {header}
      </label>
      <Input
        id={inputId}
        type="search"
        size={8}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Filter by ${header}`}
        className="h-8 w-full min-w-[6rem]"
      />
    </div>
  )
}
