import { useCallback, useState } from 'react'

export interface UsePaginationOptions {
  totalItems: number
  initialPageSize?: number
}

export interface UsePaginationResult {
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  startIndex: number
  endIndex: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  goToPrevious: () => void
  goToNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

export function usePagination({
  totalItems,
  initialPageSize = 10,
}: UsePaginationOptions): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const page = Math.min(currentPage, totalPages)
  if (page !== currentPage) {
    setCurrentPage(page)
  }

  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const setPage = useCallback(
    (nextPage: number) => {
      setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
    },
    [totalPages],
  )

  const setPageSize = useCallback((nextPageSize: number) => {
    setPageSizeState(nextPageSize)
    setCurrentPage(1)
  }, [])

  const goToPrevious = useCallback(() => setPage(page - 1), [setPage, page])
  const goToNext = useCallback(() => setPage(page + 1), [setPage, page])

  return {
    currentPage: page,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    setPage,
    setPageSize,
    goToPrevious,
    goToNext,
    canGoPrevious: page > 1,
    canGoNext: page < totalPages,
  }
}
