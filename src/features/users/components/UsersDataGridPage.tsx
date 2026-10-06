import { memo, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { CheckCheck } from 'lucide-react'

import { DataGrid } from '@/shared/components/data-grid/DataGrid'
import { DataGridSkeleton } from '@/shared/components/data-grid/DataGridSkeleton'
import type { ColumnFilterState, RowSelectionConfig } from '@/shared/components/data-grid/types'
import { PaginationControls } from '@/shared/components/pagination/PaginationControls'
import { SearchInput } from '@/shared/components/search/SearchInput'
import { EmptyState } from '@/shared/components/states/EmptyState'
import { ErrorState } from '@/shared/components/states/ErrorState'
import { Button } from '@/shared/components/ui/button'
import { userColumns } from '@/features/users/columns/userColumns'
import { useUserFilters } from '@/features/users/hooks/useUserFilters'
import { useUserSearch } from '@/features/users/hooks/useUserSearch'
import { useUserSelectOptions } from '@/features/users/hooks/useUserSelectOptions'
import { useUsers } from '@/features/users/hooks/useUsers'
import type { User } from '@/features/users/types/user.types'
import { isUserFilterKey } from '@/features/users/types/userFilter.types'
import { usePagination } from '@/shared/hooks/usePagination'
import { useRowSelection } from '@/shared/hooks/useRowSelection'

const flushInCard = 'rounded-none border-0'

const getRowId = (user: User) => user.id

const noResultsEmptyState = (
  <EmptyState
    title="No users match your filters"
    description="Try adjusting your search or column filters."
  />
)

interface UsersGridProps {
  data: readonly User[]
  selection: RowSelectionConfig
  columnFilters: ColumnFilterState
  emptyState?: ReactNode
}

const UsersGrid = memo(function UsersGrid({
  data,
  selection,
  columnFilters,
  emptyState,
}: UsersGridProps) {
  return (
    <DataGrid
      data={data}
      columns={userColumns}
      getRowId={getRowId}
      caption="Users"
      emptyState={emptyState}
      selection={selection}
      columnFilters={columnFilters}
      className={flushInCard}
    />
  )
})

export function UsersDataGridPage() {
  const { data, isPending, isError, error, isFetching, refetch } = useUsers()
  const { searchQuery, setSearchQuery, filteredUsers: searchResults } = useUserSearch(data)
  const { filters, setFilter, filteredUsers } = useUserFilters(searchResults)
  const selectOptions = useUserSelectOptions(data)
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    setPageSize,
    goToPrevious,
    goToNext,
    canGoPrevious,
    canGoNext,
  } = usePagination({
    totalItems: filteredUsers.length,
    initialPageSize: 10,
  })
  const paginatedUsers = useMemo(
    () => filteredUsers.slice(startIndex, endIndex),
    [filteredUsers, startIndex, endIndex],
  )
  const rowSelection = useRowSelection({
    data: paginatedUsers,
    getRowId,
  })
  const handleFilterChange = useCallback(
    (columnId: string, value: string) => {
      if (isUserFilterKey(columnId)) {
        setFilter(columnId, value)
      }
    },
    [setFilter],
  )
  const columnFilters = useMemo<ColumnFilterState>(
    () => ({
      values: filters,
      options: selectOptions,
      onFilterChange: handleFilterChange,
    }),
    [filters, selectOptions, handleFilterChange],
  )

  const hasUsers = data !== undefined && data.length > 0
  const selectedCount = rowSelection.selectedIds.size

  function renderContent() {
    if (isPending) {
      return (
        <DataGridSkeleton
          rows={10}
          columns={userColumns.length + 1}
          showFilters
          label="Loading users"
          className={flushInCard}
        />
      )
    }

    if (isError) {
      return (
        <ErrorState
          title="Could not load users"
          description={error.message}
          className="bg-destructive/5"
          action={
            <Button
              variant="outline"
              size="sm"
              disabled={isFetching}
              onClick={() => void refetch()}
            >
              {isFetching ? 'Retrying...' : 'Retry'}
            </Button>
          }
        />
      )
    }

    if (data.length === 0) {
      return <EmptyState title="No users found" description="The API returned an empty list." />
    }

    if (filteredUsers.length === 0) {
      return (
        <UsersGrid
          data={filteredUsers}
          selection={rowSelection}
          columnFilters={columnFilters}
          emptyState={noResultsEmptyState}
        />
      )
    }

    return (
      <>
        <UsersGrid
          data={paginatedUsers}
          selection={rowSelection}
          columnFilters={columnFilters}
        />
        <div className="border-t border-border bg-muted/30 px-2 py-3 sm:px-3">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onPageSizeChange={setPageSize}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
        </div>
      </>
    )
  }

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
        <header className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Users</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter, and manage user records in one place.
          </p>
        </header>

        {hasUsers ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, username, email, phone or website"
              label="Search users"
              className="w-full min-w-0 sm:max-w-md sm:flex-1"
            />
            {selectedCount > 0 ? (
              <p className="inline-flex w-fit shrink-0 items-center gap-1.5 self-start rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium whitespace-nowrap text-primary">
                <CheckCheck aria-hidden="true" className="size-3.5" />
                {selectedCount} {selectedCount === 1 ? 'row' : 'rows'} selected
              </p>
            ) : null}
          </div>
        ) : null}

        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {renderContent()}
        </section>
      </div>
    </main>
  )
}
