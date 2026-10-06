# AGENTS.md

Permanent technical rules for this project. These rules apply to every phase
and take precedence over ad-hoc instructions unless explicitly overridden.

## 1. Project Stack

- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query for server/API state
- Native React state for local UI state
- Lucide React

Do not introduce Redux, Zustand, MUI DataGrid, AG Grid, or other major
libraries unless explicitly approved.

## 2. TypeScript Source Integrity

- Application source inside `src/` must use `.ts` / `.tsx`
- Never generate, create, or copy `.js` / `.jsx` duplicates of TypeScript
  source files
- Never create `App.js`, `main.js`, or similar compiled copies inside `src/`
- Build/transpiled output must stay outside `src/` (e.g. `dist/`)
- Legitimate JavaScript tooling/config files are allowed only when actually
  required
- Before creating any `.js` file, verify that it is intentional and not a
  compiled duplicate

## 3. Architecture

### 3.1 Reusability

The DataGrid must be generic and reusable.

Use:

```tsx
DataGrid<User>
```

It must not be coupled to the User model. The final component should be
capable of working with `DataGrid<User>` and `DataGrid<Product>` without
modifying the DataGrid implementation.

### 3.2 Separation of Responsibilities

Keep these responsibilities separate:

```
API / Server State -> Feature Logic -> Reusable Components -> UI
```

The DataGrid must NOT:

- fetch data
- know API URLs
- know about Users
- contain User-specific business logic, search, filters, pagination, or
  selection business logic

### 3.3 Feature Structure

User-specific code belongs inside `features/users`.

Generic reusable code belongs inside reusable component/hooks/utils areas.

Do not put User-specific logic inside reusable components.

### 3.4 General Principles

- Keep API logic, hooks, domain logic, and presentation separated
- Prefer feature-based organization for user-specific logic
- Do not introduce abstractions unless they solve a real reusable problem
- Keep `DataGrid` generic and reusable
- If a requested change conflicts with existing architecture, stop and explain
  the conflict before making broad changes

## 4. TypeScript

- Use strict TypeScript
- Do not use `any`
- Prefer explicit and meaningful types
- Avoid unnecessary type assertions
- Keep generic relationships strongly typed
- Do not use type assertions merely to silence TypeScript errors
- Prefer proper generic types, narrowing, and `satisfies` where appropriate
- If TypeScript reports an error, inspect and fix the underlying type design
  rather than hiding the error

## 5. Server State

Use TanStack Query for server/API state.

Do not manually recreate server-state management with unnecessary
`useEffect` + `useState` patterns.

## 6. UI State

Use React state for local UI state unless a real requirement demonstrates the
need for global state.

## 7. Data Integrity

- Do not modify the original API response data
- Filtering, searching, pagination, and selection should operate through
  derived state/data rather than mutating the source data
- Preserve the API response shape unless transformation is explicitly required
- Row selection must remain separate from filtering/pagination logic

## 8. Reusability vs Over-Engineering

Do not create abstractions just for the sake of abstraction.

Every reusable abstraction should have a clear reason to exist.

Prefer simple, readable solutions.

## 9. Performance

- Use `useMemo`, `useCallback`, and `React.memo` only when there is a concrete
  performance/re-render reason
- Do not add memoization mechanically
- Use debouncing where required by the task
- Avoid unnecessary derived state

## 10. Dependencies

Do not install a package unless it provides clear value for the task.

Prefer native React and browser APIs when they are sufficient.

## 11. Development Process

The project will be implemented in phases.

Do not implement future phases unless explicitly requested.

When implementing a phase:

- Inspect the existing architecture and current implementation before coding
- Modify only what is necessary
- Preserve existing architecture and working behavior
- Do not rewrite unrelated code
- Do not introduce speculative features
- Keep each phase focused and reviewable
- Do not rename/move files unnecessarily
- Do not add dependencies unless necessary and explicitly justified

## 12. Data/API

- Use TanStack Query for server state
- Keep HTTP logic in the API layer
- API functions must not contain React/UI logic
- Do not modify JSONPlaceholder data

## 13. Current DataGrid Task Rules

- Global search searches Name, Username, Email, Phone, and Website
- Column filters:
  - Name: text
  - Username: text
  - Email: text
  - Company: select
  - City: select
  - Website: text
- ID and Phone do not have column filters unless the task explicitly changes
- Multiple filters use AND logic
- Company/City select options must be derived from the original users dataset,
  not already-filtered results
- Text filters use the existing debounce approach; select filters remain
  immediate
- Client-side pagination is applied after search and column filtering
- Row selection must remain separate from filtering/pagination logic

## 14. Phase-Based Workflow & Change Discipline

- Implement only the currently requested phase
- Do not implement future phases early
- Before coding a phase, inspect the existing architecture and current
  implementation
- Keep each phase focused and reviewable
- Do not rewrite working architecture without a clear reason
- Do not rename/move files unnecessarily
- Do not add dependencies unless necessary and explicitly justified
- Preserve existing working behavior when implementing a new phase
- If a requested change conflicts with existing architecture, stop and explain
  the conflict before making broad changes

## 15. Verification

Before declaring a phase complete:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Also verify that:

- No generated `.js/.jsx` duplicates exist inside `src/`
- No temporary/debug files remain
- No unnecessary dependencies were added
- Existing functionality still works
- Review the resulting `AGENTS.md` for contradictions or duplicate rules and
  keep it concise and consistent

Do not create temporary debug/smoke scripts unless explicitly requested.
Remove temporary files created during debugging before finishing the phase.

