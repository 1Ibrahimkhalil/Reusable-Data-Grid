import type { User } from '../types/user.types'

const SEARCHABLE_FIELDS = ['name', 'username', 'email', 'phone', 'website'] as const

export function filterUsers(users: readonly User[], query: string): User[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (normalizedQuery === '') {
    return [...users]
  }

  return users.filter((user) =>
    SEARCHABLE_FIELDS.some((field) => user[field].toLowerCase().includes(normalizedQuery)),
  )
}