# Reusable Data Grid

A generic, dependency-light `DataGrid<T>` built from scratch (no grid library),
demonstrated with a Users feature that fetches real data from JSONPlaceholder.
The grid is fully reusable: it receives data and column definitions as props and
has no knowledge of any domain model.

Permanent project rules live in [`AGENTS.md`](./AGENTS.md).

## Key features

- Generic, typed `DataGrid<T>` usable with any entity (`DataGrid<User>`, `DataGrid<Product>`, ...)
- Global client-side search across 5 fields, debounced
- Per-column filters: text inputs and select dropdowns, combined with AND logic
- Client-side pagination with configurable page size
- Row selection with select-all (visible rows) and a selected-count badge
- Loading skeleton, error state with retry, empty state, and filtered no-results state
- Responsive layout: no page-level horizontal scrolling; the table scrolls horizontally only inside its own container
- Strict TypeScript, feature-based organization, separated API / feature / component layers

## Tech stack

| Layer        | Choice                                            |
| ------------ | ------------------------------------------------- |
| UI           | React 19, TypeScript (strict), Vite 8             |
| Styling      | Tailwind CSS v4, shadcn/ui components             |
| Server state | TanStack Query v5                                 |
| UI state     | Native React state (`useState`, `useMemo`, `useCallback`) |
| Icons        | Lucide React                                      |
| Linting      | oxlint                                            |
| HTTP         | Native `fetch` through a generic `apiClient<T>`   |

Path alias: `@` → `src` (configured in `vite.config.ts`).

## Architecture

Dependencies flow in one direction:

```
API / server state  ->  feature logic  ->  reusable components  ->  UI
(shared/api)           (features/users)   (shared/components)
```

- **API layer** (`shared/api`, `features/*/api`): HTTP only. No React or UI code.
- **Feature layer** (`features/users`): hooks, filtering/search utilities, column
  definitions, and the page composition root. The only place `User`-specific code lives.
- **Reusable components** (`shared/components`): presentation-only. `DataGrid<T>`
  never fetches, never reads API URLs, and contains no user-specific logic.
- **UI state** stays local (no global state library).

### Folder structure

```
src/
├── features/
│   └── users/                  # user-specific code lives only here
│       ├── api/                # getUsers() -> apiClient + API_ENDPOINTS
│       ├── columns/            # userColumns (ColumnDef<User>[] with filters)
│       ├── components/         # UsersDataGridPage (composition root)
│       ├── hooks/              # useUsers, useUserSearch, useUserFilters,
│       │                       # useUserSelectOptions
│       ├── types/              # User model, UserFilters, isUserFilterKey
│       └── utils/              # filterUsers, applyColumnFilters
├── shared/
│   ├── api/                    # apiClient<T>, API_ENDPOINTS
│   ├── components/
│   │   ├── data-grid/          # DataGrid<T>, DataGridSkeleton, ColumnDef<T>
│   │   │   ├── filters/        # ColumnFilterCell -> Text/SelectColumnFilter
│   │   │   └── selection/      # RowSelectionControl, SelectAllCheckbox
│   │   ├── pagination/         # PaginationControls (controlled)
│   │   ├── search/             # SearchInput (controlled)
│   │   ├── states/             # EmptyState, ErrorState
│   │   └── ui/                 # shadcn/ui primitives (button, input, skeleton)
│   ├── hooks/                  # useDebounce, usePagination, useRowSelection
│   └── lib/utils.ts            # cn() helper
├── App.tsx
├── main.tsx                    # QueryClientProvider setup
└── index.css                   # Tailwind v4 + design tokens
```

## Reusable DataGrid

`DataGrid<T>` renders a semantic `<table>` and is driven entirely by props:

```tsx
<DataGrid<User>
  data={paginatedUsers}
  columns={userColumns}
  getRowId={(user) => user.id}
  caption="Users"
  selection={rowSelection}
  columnFilters={columnFilters}
  className="rounded-none border-0"
/>
```

| Prop            | Type                          | Purpose                                      |
| --------------- | ----------------------------- | -------------------------------------------- |
| `data`          | `readonly T[]`                | Rows to render (already filtered/paginated)  |
| `columns`       | `readonly ColumnDef<T>[]`     | Column definitions                           |
| `getRowId`      | `(row: T) => RowId`           | Stable row identity for selection            |
| `caption`       | `string?`                     | Accessible table caption (`sr-only`)         |
| `emptyState`    | `ReactNode?`                  | Custom empty/no-results content              |
| `selection`     | `RowSelectionConfig?`         | Enables the checkbox column                 |
| `columnFilters` | `ColumnFilterState?`          | Enables the filter row                       |
| `className`     | `string?`                     | Wrapper styling                              |

A column is declared once and controls header, value, optional custom cell, and
optional filter:

```ts
const columns: ColumnDef<User>[] = [
  { id: 'id', header: 'ID', accessor: (u) => u.id, headerClassName: 'w-16 min-w-16' },
  { id: 'name', header: 'Name', accessor: (u) => u.name, filter: { type: 'text' } },
  { id: 'city', header: 'City', accessor: (u) => u.address.city, filter: { type: 'select' } },
]
```

Because the component is generic, the same implementation works for any entity —
swapping in `DataGrid<Product>` requires no changes to `DataGrid` itself.

**Responsibilities of the grid:** render rows/cells, the optional selection
column, and the optional filter row (via the controlled `ColumnFilterCell`).

**Not the grid's responsibility:** fetching, search, filter, pagination, or
selection business logic — all of that is derived state computed by feature hooks
and passed in.

## Search, filters, pagination, selection

All data operations are client-side and operate on derived arrays; the original
API response is never mutated.

### Search

- `SearchInput` (controlled) → `useUserSearch` → generic `useDebounce` (300 ms) → `filterUsers`
- Case-insensitive substring match across `name`, `username`, `email`, `phone`, `website`

### Column filters

| Column   | Filter type | Behavior                                   |
| -------- | ----------- | ------------------------------------------ |
| Name     | text        | debounced (300 ms), case-insensitive match |
| Username | text        | debounced (300 ms), case-insensitive match |
| Email    | text        | debounced (300 ms), case-insensitive match |
| Website  | text        | debounced (300 ms), case-insensitive match |
| Company  | select      | exact match, applied immediately           |
| City     | select      | exact match, applied immediately           |

- `ID` and `Phone` have no column filters.
- Multiple filters (and the global search) combine with **AND** logic.
- Company/City options are derived from the **original** users dataset
  (`useUserSelectOptions`, sorted unique values), never from already-filtered
  results — so an option can never be lost by applying another filter.
- Filter state and options are passed to the grid as a controlled
  `ColumnFilterState` (`values`, `options`, `onFilterChange`).

### Pagination

- `usePagination` (controlled hook) + generic `PaginationControls`
- Previous/Next, "Page X of Y · N results", rows-per-page select (`5, 10, 25, 50, 100`, default `10`)
- Applied **after** search and column filtering; changing the page size resets to page 1

### Row selection

- `useRowSelection` keeps a `Set<RowId>` independent of filtering and pagination —
  selections survive page changes and are never derived from the visible slice
- Header checkbox: select/deselect all **currently visible** rows, with an
  indeterminate state
- A "N rows selected" badge appears above the grid while any row is selected

## UI states

| State                | Rendering                                                                |
| -------------------- | ------------------------------------------------------------------------ |
| Loading              | `DataGridSkeleton` (10 rows + filter row, `role="status"`, sr-only label) |
| Request error        | `ErrorState` with the error message and a Retry button (`refetch`)       |
| API returns `[]`     | `EmptyState` — "No users found"                                          |
| No matching results  | `DataGrid` with a custom empty state; the filter row stays rendered so filters can be adjusted |

Errors are thrown by `apiClient` (`Request failed: <status> <statusText>`); the
query is configured with `staleTime: 5 min` and `retry: 1`, and the Retry button
is disabled while a refetch is in flight.

## API

- **Source:** [JSONPlaceholder](https://jsonplaceholder.typicode.com) — a free fake REST API. Data is read-only for this task and is not modified.

| Piece             | Location                        | Role                                                    |
| ----------------- | ------------------------------- | ------------------------------------------------------- |
| `API_BASE_URL`    | `shared/api/apiClient.ts`       | `https://jsonplaceholder.typicode.com`                  |
| `API_ENDPOINTS`   | `shared/api/endpoints.ts`       | `{ users: '/users' }`                                   |
| `apiClient<T>`    | `shared/api/apiClient.ts`       | `fetch`, `response.ok` check, JSON parse, typed result  |
| `getUsers(signal)`| `features/users/api/usersApi.ts`| Feature API function; supports `AbortSignal`            |
| `useUsers()`      | `features/users/hooks/useUsers.ts` | `useQuery({ queryKey: ['users'], queryFn })`         |

Request flow:

```
useUsers (TanStack Query)
  └─> getUsers(signal)
        └─> apiClient<User[]>('/users')
              └─> GET https://jsonplaceholder.typicode.com/users
```

API functions contain no React/UI logic; query caching, loading, error, and
refetch handling are provided by TanStack Query.

## Responsive behavior

- Page content is capped at `max-w-7xl` with fluid padding (`px-4` → `sm:px-6`).
- Header, search row, and pagination wrap to a single column on small screens.
- The table has a content-driven minimum width (`min-w-[46rem]`) and scrolls
  **horizontally only inside its own container** — the page itself never scrolls
  horizontally at any viewport size (verified from 320 px to 1920 px, including
  loading, empty, error, and no-results states).
- The grid scroll container is a positioning context, so visually hidden
  (`sr-only`) labels inside it stay clipped within the container instead of
  widening the document.
- No `overflow-x-hidden` workaround is used at the page level.

## Getting started

**Prerequisites:** Node.js `^20.19.0 || >=22.12.0` and npm.

```bash
# 1. install dependencies
npm install

# 2. start the dev server (http://localhost:5173)
npm run dev
```

No environment variables are required — the API base URL is a constant in
`src/shared/api/apiClient.ts`.

## Available scripts

| Script                | Command               | Description                              |
| --------------------- | --------------------- | ---------------------------------------- |
| `npm run dev`         | `vite`                | Start the Vite dev server                |
| `npm run build`       | `tsc -b && vite build`| Typecheck + production build to `dist/`  |
| `npm run typecheck`   | `tsc -b`              | TypeScript project build check           |
| `npm run lint`        | `oxlint`              | Lint the project (React/TS rules)        |
| `npm run preview`     | `vite preview`        | Serve the production build locally       |

## Verification

Run before considering a change complete:

```bash
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run build
```

- **Lint** — `oxlint` with React and TypeScript plugins (`react/rules-of-hooks` as error).
- **Typecheck** — strict TypeScript, no `any`, no emitted files.
- **Build** — full typecheck plus the production bundle in `dist/`.

Additional conventions enforced by the project rules in `AGENTS.md`: TypeScript
source stays `.ts`/`.tsx` inside `src/`, generated output stays outside `src/`,
and no state-management or grid libraries are added without approval.
