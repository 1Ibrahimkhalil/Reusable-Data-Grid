import type { UserFilters, UserFilterKey } from '../types/userFilter.types'
import type { User } from '../types/user.types'

type UserFilterMatcher = (user: User, query: string) => boolean

const containsIgnoreCase = (text: string, query: string): boolean =>
  text.toLowerCase().includes(query.toLowerCase())

const FILTER_MATCHERS = {
  name: (user, query) => containsIgnoreCase(user.name, query),
  username: (user, query) => containsIgnoreCase(user.username, query),
  email: (user, query) => containsIgnoreCase(user.email, query),
  company: (user, query) => user.company.name === query,
  city: (user, query) => user.address.city === query,
  website: (user, query) => containsIgnoreCase(user.website, query),
} as const satisfies Record<UserFilterKey, UserFilterMatcher>

export function applyColumnFilters(
  users: readonly User[],
  filters: UserFilters,
): User[] {
  return users.filter((user) =>
    (Object.keys(FILTER_MATCHERS) as UserFilterKey[]).every((key) => {
      const query = filters[key]
      return query === '' || FILTER_MATCHERS[key](user, query)
    }),
  )
}
