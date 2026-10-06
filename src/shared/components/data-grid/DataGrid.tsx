import { EmptyState } from '@/shared/components/states/EmptyState'
import { cn } from '@/shared/lib/utils'
import { DATA_GRID_TABLE_CLASS_NAME } from './constants'
import { ColumnFilterCell } from './filters/ColumnFilterCell'
import { RowSelectionControl } from './selection/RowSelectionControl'
import { SelectAllCheckbox } from './selection/SelectAllCheckbox'
import type { DataGridProps } from './types'

function renderValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">&mdash;</span>
  }

  return typeof value === 'string' ? value : String(value)
}

export function DataGrid<T>({
  data,
  columns,
  getRowId,
  caption,
  emptyState,
  className,
  selection,
  columnFilters,
}: DataGridProps<T>) {
  const hasFilterRow =
    columnFilters !== undefined && columns.some((column) => column.filter !== undefined)
  const totalColumns = columns.length + (selection ? 1 : 0)

  if (data.length === 0 && columnFilters === undefined) {
    return (
      <div className={cn('relative min-w-0 overflow-hidden rounded-lg border border-border', className)}>
        {emptyState ?? <EmptyState />}
      </div>
    )
  }

  return (
    <div className={cn('relative min-w-0 overflow-x-auto rounded-lg border border-border', className)}>
      <table className={DATA_GRID_TABLE_CLASS_NAME}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-border bg-muted/60">
            {selection ? (
              <th
                scope="col"
                className="w-10 min-w-10 px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground sm:px-3"
              >
                <SelectAllCheckbox
                  checked={selection.allVisibleSelected}
                  indeterminate={selection.someVisibleSelected}
                  onChange={selection.onSelectAll}
                  label="Select all visible rows"
                />
              </th>
            ) : null}
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  'px-2 py-2.5 text-left text-xs font-semibold tracking-wide text-muted-foreground sm:px-3',
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
          {hasFilterRow ? (
            <tr className="border-b border-border bg-muted/40">
              {selection ? (
                <td className="px-2 py-2 align-middle sm:px-3" />
              ) : null}
              {columns.map((column) => (
                <td
                  key={column.id}
                  className="px-2 py-2 align-middle sm:px-3"
                >
                  {column.filter && columnFilters ? (
                    <ColumnFilterCell
                      header={column.header}
                      filter={column.filter}
                      value={columnFilters.values[column.id] ?? ''}
                      options={columnFilters.options?.[column.id]}
                      onChange={(value) => columnFilters.onFilterChange(column.id, value)}
                      labelHidden
                    />
                  ) : null}
                </td>
              ))}
            </tr>
          ) : null}
        </thead>
        {data.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={totalColumns}>{emptyState ?? <EmptyState />}</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {data.map((row, rowIndex) => {
              const rowId = getRowId(row)
              const isSelected = selection?.selectedIds.has(rowId) ?? false

              return (
                <tr
                  key={rowId}
                  className={cn(
                    'border-b border-border/70 transition-colors last:border-b-0',
                    isSelected
                      ? 'bg-primary/10 hover:bg-primary/15'
                      : 'hover:bg-muted/60',
                  )}
                >
                  {selection ? (
                    <td className="w-10 min-w-10 px-2 py-2.5 align-middle sm:px-3">
                      <RowSelectionControl
                        checked={selection.selectedIds.has(rowId)}
                        onChange={() => selection.onRowToggle(rowId)}
                        label={`Select row ${rowId}`}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => {
                    const value = column.accessor(row)

                    return (
                      <td
                        key={column.id}
                        className={cn(
                          'px-2 py-2.5 align-middle [overflow-wrap:anywhere] sm:px-3',
                          column.cellClassName,
                        )}
                      >
                        {column.cell ? column.cell({ row, rowIndex, value }) : renderValue(value)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        )}
      </table>
    </div>
  )
}
