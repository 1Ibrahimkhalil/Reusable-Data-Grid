import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/usersApi'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: ({ signal }) => getUsers(signal),
  })
}