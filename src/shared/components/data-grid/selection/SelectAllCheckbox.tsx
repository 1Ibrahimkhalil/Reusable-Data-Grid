import { useEffect, useRef } from 'react'

export interface SelectAllCheckboxProps {
  checked: boolean
  indeterminate: boolean
  onChange: () => void
  label: string
}

export function SelectAllCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
}: SelectAllCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={onChange}
      className="size-4 cursor-pointer rounded-sm accent-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    />
  )
}
