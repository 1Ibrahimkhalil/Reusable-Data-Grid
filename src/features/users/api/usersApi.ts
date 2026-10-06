import { apiClient } from '@/shared/api/apiClient'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import type { User } from '../types/user.types'

export function getUsers(signal?: AbortSignal): Promise<User[]> {
  return apiClient<User[]>(API_ENDPOINTS.users, { signal })
}