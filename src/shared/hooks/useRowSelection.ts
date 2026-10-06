import { useCallback, useMemo, useState } from 'react'

import type { RowId, RowSelectionConfig } from '@/shared/components/data-grid/types'

export interface UseRowSelectionOptions<T> {
  data: readonly T[]
  getRowId: (row: T) => RowId
}

export function useRowSelection<T>({
  data,
  getRowId,
}: UseRowSelectionOptions<T>): RowSelectionConfig {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<RowId>>(() => new Set())

  const visibleIds = useMemo(() => data.map(getRowId), [data, getRowId])
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id))
  const someVisibleSelected =
    !allVisibleSelected && visibleIds.some((id) => selectedIds.has(id))

  const onSelectAll = useCallback(() => {
    const next = new Set(selectedIds)
    for (const id of visibleIds) {
      if (allVisibleSelected) {
        next.delete(id)
      } else {
        next.add(id)
      }
    }
    setSelectedIds(next)
  }, [visibleIds, selectedIds, allVisibleSelected])

  const onRowToggle = useCallback(
    (rowId: RowId) => {
      setSelectedIds((current) => {
        const next = new Set(current)
        if (next.has(rowId)) {
          next.delete(rowId)
        } else {
          next.add(rowId)
        }
        return next
      })
    },
    [],
  )

  return useMemo(
    () => ({
      selectedIds,
      allVisibleSelected,
      someVisibleSelected,
      onSelectAll,
      onRowToggle,
    }),
    [selectedIds, allVisibleSelected, someVisibleSelected, onSelectAll, onRowToggle],
  )
}
