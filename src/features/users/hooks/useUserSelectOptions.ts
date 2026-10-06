import { useMemo } from 'react'

import type { User } from '../types/user.types'
import type { UserSelectOptions } from '../types/userFilter.types'

export function useUserSelectOptions(
  users: readonly User[] | undefined,
): UserSelectOptions {
  return useMemo(() => {
    if (!users) {
      return { company: [], city: [] }
    }

    const companySet = new Set<string>()
    const citySet = new Set<string>()

    for (const user of users) {
      const companyName = user.company.name
      const cityName = user.address.city

      if (companyName) {
        companySet.add(companyName)
      }
      if (cityName) {
        citySet.add(cityName)
      }
    }

    const company = Array.from(companySet).sort((a, b) => a.localeCompare(b))
    const city = Array.from(citySet).sort((a, b) => a.localeCompare(b))

    return { company, city }
  }, [users])
}
