# Reusable Data Grid

A generic `DataGrid<T>` built from scratch (no grid library), wired to a `User`
feature that is the only place user-specific code lives. Includes reusable
column filters alongside client-side search.

Permanent project rules are defined in [`AGENTS.md`](./AGENTS.md).

## Stack

React 19, TypeScript (strict), Vite, Tailwind CSS v4, shadcn/ui, TanStack Query,
Lucide React, native React state.

## Scripts

```bash
npm run dev        # start the dev server
npm run typecheck  # tsc -b
npm run lint       # oxlint
npm run build      # typecheck + production build
```

## Structure

```
src/
├── features/
│   └── users/                # user-specific code lives only here
│       ├── api/              # usersApi (getUsers → apiClient + API_ENDPOINTS)
│       ├── components/       # UsersDataGridPage composition root
│       ├── hooks/            # useUsers, useUserSearch, useUserFilters, useUserSelectOptions
│       ├── types/            # User model + userFilter types (+ isUserFilterKey)
│       ├── utils/            # filterUsers, applyColumnFilters
│       └── columns/          # userColumns with filter definitions
├── shared/
│   ├── api/                  # generic apiClient + API_ENDPOINTS
│   ├── components/
│   │   ├── data-grid/        # generic DataGrid<T> + DataGridSkeleton + ColumnDef<T> types
│   │   │   ├── filters/      # ColumnFilterCell → generic Text/SelectColumnFilter
│   │   │   └── selection/    # RowSelectionControl, SelectAllCheckbox
│   │   ├── pagination/       # generic controlled PaginationControls
│   │   ├── search/           # generic controlled SearchInput
│   │   ├── states/           # ErrorState / EmptyState (reusable)
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # useDebounce, usePagination, useRowSelection
│   └── lib/utils.ts          # cn helper
├── App.tsx
└── main.tsx                  # QueryClientProvider
```

Dependencies flow one way:
`API / server state -> feature logic -> reusable components -> UI`.
`DataGrid<T>` receives `data` and `columns` as props, never fetches, and has no
knowledge of the `User` model.

Search and filtering are fully client-side: `useUserSearch` owns global search
(debounced via the generic `useDebounce` and `filterUsers`), `useUserFilters`
owns column filter state (text fields debounced, select fields instant) and
applies `applyColumnFilters`; `ColumnFilterCell` picks the generic, controlled
filter control declared by each column. `useUserSelectOptions` derives unique
Company/City values from the original users array (never from filtered
results). `UsersDataGridPage` composes these hooks, and all reusable
components remain presentation-only.