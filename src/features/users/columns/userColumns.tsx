import type { CellRenderContext, ColumnDef } from '@/shared/components/data-grid/types'
import type { UserFilterKey } from '../types/userFilter.types'
import type { User } from '../types/user.types'

export const userColumns = [
  {
    id: 'id',
    header: 'ID',
    accessor: (user) => user.id,
    headerClassName: 'w-16 min-w-16',
    cellClassName: 'w-16 min-w-16 whitespace-nowrap tabular-nums',
  },
  {
    id: 'name',
    header: 'Name',
    accessor: (user) => user.name,
    filter: { type: 'text' },
  },
  {
    id: 'username',
    header: 'Username',
    accessor: (user) => user.username,
    filter: { type: 'text' },
  },
  {
    id: 'email',
    header: 'Email',
    accessor: (user) => user.email,
    filter: { type: 'text' },
    cell: ({ value }: CellRenderContext<User, string>) => (
      <a
        href={`mailto:${value}`}
        className="break-all py-1 text-primary underline-offset-4 hover:underline"
      >
        {value}
      </a>
    ),
  },
  {
    id: 'phone',
    header: 'Phone',
    accessor: (user) => user.phone,
  },
  {
    id: 'company',
    header: 'Company',
    accessor: (user) => user.company.name,
    filter: { type: 'select' },
  },
  {
    id: 'city',
    header: 'City',
    accessor: (user) => user.address.city,
    filter: { type: 'select' },
  },
  {
    id: 'website',
    header: 'Website',
    accessor: (user) => user.website,
    filter: { type: 'text' },
    cell: ({ value }: CellRenderContext<User, string>) => (
      <a
        href={/^https?:\/\//i.test(value) ? value : `https://${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all py-1 text-primary underline-offset-4 hover:underline"
      >
        {value}
      </a>
    ),
  },
] as const satisfies readonly ColumnDef<User>[]

type FilterableUserColumnId = Extract<(typeof userColumns)[number], { filter: unknown }>['id']

type AssertNever<T extends never> = T

export type FilterableColumnsAreUserFilterKeys = AssertNever<
  Exclude<FilterableUserColumnId, UserFilterKey>
>