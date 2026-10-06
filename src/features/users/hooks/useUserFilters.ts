import { useCallback, useMemo, useState } from 'react'

import { useDebounce } from '@/shared/hooks/useDebounce'
import type { User } from '../types/user.types'
import { applyColumnFilters } from '../utils/applyColumnFilters'
import { initialFilters, type UserFilters } from '../types/userFilter.types'

export function useUserFilters(users: readonly User[] | undefined) {
  const [filters, setFilters] = useState<UserFilters>(initialFilters)

  const textFilters = useMemo(
    () => ({
      name: filters.name,
      username: filters.username,
      email: filters.email,
      website: filters.website,
    }),
    [filters],
  )

  const debouncedTextFilters = useDebounce(textFilters)

  const committedFilters = useMemo<UserFilters>(
    () => ({
      ...debouncedTextFilters,
      company: filters.company,
      city: filters.city,
    }),
    [debouncedTextFilters, filters.company, filters.city],
  )

  const filteredUsers = useMemo(() => {
    if (!users) {
      return []
    }

    return applyColumnFilters(users, committedFilters)
  }, [users, committedFilters])

  const setFilter = useCallback((columnId: keyof UserFilters, value: string) => {
    setFilters((current) => ({
      ...current,
      [columnId]: value,
    }))
  }, [])

  return {
    filters,
    setFilter,
    filteredUsers,
  }
}
