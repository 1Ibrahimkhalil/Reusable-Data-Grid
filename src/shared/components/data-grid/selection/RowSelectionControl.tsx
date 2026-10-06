export interface RowSelectionControlProps {
  checked: boolean
  onChange: () => void
  label: string
}

export function RowSelectionControl({ checked, onChange, label }: RowSelectionControlProps) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={onChange}
      className="size-4 cursor-pointer rounded-sm accent-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    />
  )
}
