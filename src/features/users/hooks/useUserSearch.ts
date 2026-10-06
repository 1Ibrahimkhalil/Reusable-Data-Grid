import { useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { User } from '../types/user.types'
import { filterUsers } from '../utils/filterUsers'

export function useUserSearch(users: readonly User[] | undefined) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery)

  const filteredUsers = useMemo(
    () => (users ? filterUsers(users, debouncedSearchQuery) : []),
    [users, debouncedSearchQuery],
  )

  return { searchQuery, setSearchQuery, filteredUsers }
}