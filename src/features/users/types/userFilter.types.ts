export type UserFilterKey =
  | 'name'
  | 'username'
  | 'email'
  | 'company'
  | 'city'
  | 'website'

export type UserFilters = Record<UserFilterKey, string>

export const initialFilters: UserFilters = {
  name: '',
  username: '',
  email: '',
  company: '',
  city: '',
  website: '',
}

export type UserSelectOptions = {
  company: string[]
  city: string[]
}

export function isUserFilterKey(value: string): value is UserFilterKey {
  return value in initialFilters
}
