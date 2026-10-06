import type { ReactNode } from 'react'

export type RowId = string | number

export interface CellRenderContext<T, TValue = unknown> {
  row: T
  rowIndex: number
  value: TValue
}

export interface ColumnFilterDefinition {
  type: 'text' | 'select'
}

export interface ColumnDef<T, TValue = unknown> {
  id: string
  header: string
  accessor: (row: T) => TValue
  cell?(context: CellRenderContext<T, TValue>): ReactNode
  cellClassName?: string
  headerClassName?: string
  filter?: ColumnFilterDefinition
}

export interface ColumnFilterState {
  values: Readonly<Record<string, string>>
  options?: Readonly<Partial<Record<string, readonly string[]>>>
  onFilterChange: (columnId: string, value: string) => void
}

export interface RowSelectionConfig {
  selectedIds: ReadonlySet<RowId>
  allVisibleSelected: boolean
  someVisibleSelected: boolean
  onSelectAll: () => void
  onRowToggle: (rowId: RowId) => void
}

export interface DataGridProps<T> {
  data: readonly T[]
  columns: readonly ColumnDef<T>[]
  getRowId: (row: T) => RowId
  caption?: string
  emptyState?: ReactNode
  className?: string
  selection?: RowSelectionConfig
  columnFilters?: ColumnFilterState
}