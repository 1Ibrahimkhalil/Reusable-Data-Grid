import type { ColumnFilterDefinition } from '../types'
import { SelectColumnFilter } from './SelectColumnFilter'
import { TextColumnFilter } from './TextColumnFilter'

export interface ColumnFilterCellProps {
  header: string
  filter: ColumnFilterDefinition
  value: string
  options?: readonly string[]
  onChange: (value: string) => void
  labelHidden?: boolean
}

export function ColumnFilterCell({
  header,
  filter,
  value,
  options,
  onChange,
  labelHidden,
}: ColumnFilterCellProps) {
  switch (filter.type) {
    case 'text': {
      return (
        <TextColumnFilter
          header={header}
          value={value}
          onChange={onChange}
          labelHidden={labelHidden}
        />
      )
    }
    case 'select': {
      return (
        <SelectColumnFilter
          header={header}
          value={value}
          onChange={onChange}
          options={options ?? []}
          labelHidden={labelHidden}
        />
      )
    }
    default: {
      return null
    }
  }
}
