# Implementation Plan

This document converts the current todo list into a persistent implementation plan. Each task is small, independently testable, and mapped to the specification in `docs/frontend-spec.md`, `docs/api-contract.md`, and `docs/testing.md`.

---

### Task T1
- Task name: Init repo scaffold
- Requirement/reference: Project toolchain and developer experience (Vite, TypeScript, Tailwind, linters, test runner)
- Description: Create base project scaffolding to run, build, lint, and test the frontend. Adds `package.json`, Vite + TS template, Tailwind setup, ESLint/Prettier, and Vitest configuration.
- Dependencies: `vite`, `react`, `react-dom`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint`, `prettier`, `vitest`, `@testing-library/react`
- Files/modules expected to change: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.cjs`, `postcss.config.cjs`, `.eslintrc.cjs`, `.prettierrc`, `vitest.config.ts`, `.gitignore`, `README.md`
- Tests required: Smoke test that a sample component renders with `vitest` and that `npm run build` exits successfully.
- Acceptance criteria: `npm run dev` starts a dev server; `npm run build` completes; `npm test` runs and passes smoke test.
- Status: Complete

---

### Task T2
- Task name: Add CI & test pipeline
- Requirement/reference: Continuous integration for lint, tests, and build (see `docs/testing.md`)
- Description: Add GitHub Actions workflow to run `install`, `lint`, `test`, and `build` on push/PR.
- Dependencies: GitHub Actions (workflow file only)
- Files/modules expected to change: `.github/workflows/ci.yml`
- Tests required: CI workflow runs and completes on a sample PR or push.
- Acceptance criteria: PR triggers CI and checks pass (lint, tests, build).
- Status: Complete


---

### Task T3
- Task name: Design tokens & styles
- Requirement/reference: Centralized design tokens and theming (frontend spec Components & Styles)
- Description: Add design tokens, Tailwind configuration, and base CSS; expose `src/styles/tokens.ts` for component use.
- Dependencies: Tailwind CSS (from T1)
- Files/modules expected to change: `src/styles/tokens.ts`, `tailwind.config.cjs`, `src/styles/globals.css`
- Tests required: Unit test importing tokens and a visual/snapshot test for a token-driven component.
- Acceptance criteria: Tokens are importable; Tailwind classes built and component styles respect tokens.
- Status: Complete

---

### Task T4
- Task name: UI primitives
- Requirement/reference: Shared UI primitives listed in `docs/frontend-spec.md` (Button, Input, Modal, Card, Skeleton)
- Description: Implement accessible, themeable primitives under `src/components/ui` used across app pages.
- Dependency: Tailwind, design tokens (T3), Radix/shadcn components (optional)
- Files/modules expected to change: `src/components/ui/Button.tsx`, `Input.tsx`, `Modal.tsx`, `Card.tsx`, `Skeleton.tsx`, `src/components/ui/index.ts`
- Tests required: Unit tests for rendering and interaction; accessibility checks (axe) for each component.
- Acceptance criteria: Components render, accept props/variants, and pass a11y checks.
- Status: Complete

---

### Task T5
- Task name: API client layer
- Requirement/reference: Centralized API contract (`docs/api-contract.md`) and error format
- Description: Implement a single API client wrapper for `/api/v1` with standardized error parsing and correlationId handling.
- Dependencies: `axios` or fetch wrapper, TanStack Query (for later integration)
- Files/modules expected to change: `src/lib/api/client.ts`, `src/lib/api/endpoints.ts`, `src/lib/api/types.ts`
- Tests required: Unit tests mocking network responses for success and error payloads per API contract.
- Acceptance criteria: Client calls `/api/v1/*`, parses error format, and surfaces errors to callers consistently.
- Status: Not Started

---

### Task T6
- Task name: Auth/session skeleton
- Requirement/reference: Auth endpoints and secure token handling (`docs/api-contract.md`, AGENTS.md rules)
- Description: Implement login/register/otp flows skeleton and secure session management; avoid `localStorage` for tokens.
- Dependencies: API client (T5); state library choice (T7)
- Files/modules expected to change: `src/lib/auth/session.ts`, `src/lib/api/auth.ts`, `src/hooks/useAuth.ts`, `src/pages/login/*`
- Tests required: Unit tests for `useAuth` and session helpers (mock API); integration test for login flow.
- Acceptance criteria: `login` and `logout` flows update session state; tokens are not persisted to `localStorage` and `logout` calls `/auth/logout`.
- Status: Not Started

---

### Task T7
- Task name: State management setup
- Requirement/reference: Use TanStack Query for server data; pick `Zustand` or `Redux Toolkit` for client state (AGENTS.md)
- Description: Add and configure React Query provider and create a small UI store for ephemeral UI state (cart drawer, filters) using chosen library.
- Dependencies: `@tanstack/react-query`, `zustand` or `@reduxjs/toolkit`
- Files/modules expected to change: `src/lib/queryClient.ts`, `src/state/store.ts`, `src/App.tsx` (provider setup)
- Tests required: Unit tests for store actions; Query client basic config test.
- Acceptance criteria: QueryClient provider set up, store exports and functions behave as expected.
- Status: Not Started

---

### Task T8
- Task name: Product listing & search
- Requirement/reference: Search and product browsing (frontend-spec Search and Product sections)
- Description: Implement product listing page, search with debounce/typeahead and use of `/search` and `/search/suggest`, filters, sorting, and pagination.
- Dependencies: API client (T5), Query client (T7)
- Files/modules expected to change: `src/pages/ProductsPage.tsx`, `src/components/product/ProductGrid.tsx`, `src/components/product/ProductCard.tsx`, `src/lib/api/products.ts`, `src/hooks/useSearch.ts`
- Tests required: Unit tests for `useSearch` debounce; component tests for ProductGrid; integration tests with mocked API.
- Acceptance criteria: Search triggers after 2+ chars and debounce; suggestions returned; filters/pagination update results.
- Status: Not Started

---

### Task T9
- Task name: Product detail page
- Requirement/reference: Product detail & add-to-cart behavior (frontend-spec Product, Cart)
- Description: Implement product detail page, product metadata, and add-to-cart action that uses server-validated stock/prices.
- Dependencies: API client, Query client, state store
- Files/modules expected to change: `src/pages/ProductDetail.tsx`, `src/components/product/ProductDetailCard.tsx`, `src/lib/api/products.ts`, `src/state/cartStore.ts`
- Tests required: Component tests for detail view; integration tests for add-to-cart action with mock server responses.
- Acceptance criteria: Product details show correctly; add-to-cart makes server call and UI updates or shows server error.
- Status: Not Started

---

### Task T10
- Task name: Cart & guest cart behavior
- Requirement/reference: Guest cart behavior and persistence (frontend-spec Cart)
- Description: Implement guest cart add/update/remove with local persistence that supports merging into server cart after auth.
- Dependencies: `idb-keyval` or `localForage` for safe local persistence; cart API endpoints
- Files/modules expected to change: `src/state/guestCart.ts`, `src/lib/persistence/guestCartStorage.ts`, `src/components/cart/CartSummary.tsx`
- Tests required: Unit tests for guest cart operations and persistence; integration test for persistence across reloads.
- Acceptance criteria: Guest cart operations work and persist; stored format is mergeable with server cart.
- Status: Not Started

---

### Task T11
- Task name: Cart merge on login
- Requirement/reference: Merge guest cart into account cart after authentication (frontend-spec Cart)
- Description: On successful login, merge guest cart with server cart using API calls; clear guest cart storage on success.
- Dependencies: Auth (T6), API client (T5), guest cart storage (T10)
- Files/modules expected to change: `src/hooks/useCartMerge.ts`, `src/lib/api/cart.ts`, `src/state/cartStore.ts`, `src/pages/login/*`
- Tests required: Integration test mocking login and merge endpoint; unit tests for merge logic.
- Acceptance criteria: After login, server cart reflects merged items; guest cart cleared; UI shows merged cart.
- Status: Not Started

---

### Task T12
- Task name: Checkout flow
- Requirement/reference: Checkout, idempotency, address selection and server-calculated summary (frontend-spec Checkout, API contract Orders)
- Description: Implement checkout pages/components for address selection, server-calculated order summary, idempotency key generation and submission to `POST /orders`.
- Dependencies: Auth (T6), API client (T5), UUID library for idempotency
- Files/modules expected to change: `src/pages/Checkout/*`, `src/components/checkout/AddressForm.tsx`, `src/components/checkout/OrderSummary.tsx`, `src/lib/api/orders.ts`
- Tests required: Integration tests for checkout happy path and common failures; unit tests for idempotency key generation handling.
- Acceptance criteria: Auth required to access checkout; server summary is shown; `POST /orders` called with idempotency key and order created once.
- Status: Not Started

---

### Task T13
- Task name: Orders list & detail
- Requirement/reference: Orders list and detail with timeline (frontend-spec Orders)
- Description: Implement order history list and order detail with timeline and readonly status display.
- Dependencies: API client (T5), Query client (T7)
- Files/modules expected to change: `src/pages/Orders.tsx`, `src/pages/OrderDetail.tsx`, `src/components/order/OrderTimeline.tsx`, `src/lib/api/orders.ts`
- Tests required: Component tests for list/detail; integration tests for fetching order data and timeline rendering.
- Acceptance criteria: Orders list shows ID/date/count/thumbnail/total/status; detail shows timeline and order items; user cannot edit status.
- Status: Not Started

---

### Task T14
- Task name: Cancellation & support UI
- Requirement/reference: Cancellation rules and support request behavior (frontend-spec Cancellation/support)
- Description: Show self-cancel option when server indicates eligibility (pre-24h and unshipped); otherwise show support request form; call appropriate endpoints.
- Dependencies: Orders API (T13), API client (T5)
- Files/modules expected to change: `src/components/order/CancellationForm.tsx`, `src/pages/OrderDetail.tsx`, `src/lib/api/orders.ts`
- Tests required: Unit tests for eligibility UI; integration tests for cancel and support request API calls.
- Acceptance criteria: Correct UI shown per eligibility; cancel succeeds when allowed; support requests submit correctly.
- Status: Not Started

---

### Task T15
- Task name: Admin layout & auth UX
- Requirement/reference: Separate `/admin/**` layout and UX (frontend-spec Admin)
- Description: Create dedicated admin layout and route group; implement UX-only route guards while relying on backend for enforcement.
- Dependencies: Router (React Router or chosen), Auth (T6)
- Files/modules expected to change: `src/pages/admin/Layout.tsx`, `src/pages/admin/index.tsx`, route configuration
- Tests required: Render tests for layout; integration tests verifying server 403 handling when unauthorized.
- Acceptance criteria: Admin routes render with admin layout; unauthorized attempts produce proper error UI and do not expose sensitive actions.
- Status: Not Started

---

### Task T16
- Task name: Admin product CRUD
- Requirement/reference: Admin product management, stock, discounts, and audit (frontend-spec Admin + API contract)
- Description: Implement admin product create/update/delete UI and endpoints for stock and discount management; surface server errors and confirmations.
- Dependencies: API client (T5), admin auth UX (T15)
- Files/modules expected to change: `src/pages/admin/products/*`, `src/components/admin/ProductForm.tsx`, `src/lib/api/admin/products.ts`
- Tests required: Unit tests for forms; integration tests mocking admin APIs for success and error cases.
- Acceptance criteria: Admin users can create/update/delete products and edit stock/discounts; server validation errors are shown.
- Status: Not Started

---

### Task T17
- Task name: Testing: unit & integration
- Requirement/reference: `docs/testing.md` — Vitest + RTL and MSW for mocking
- Description: Add unit and integration tests for components and flows using Vitest + React Testing Library and MSW for API mocking.
- Dependencies: `vitest`, `@testing-library/react`, `msw`
- Files/modules expected to change: `tests/unit/*`, `tests/integration/*`, `vitest.config.ts`
- Tests required: Tests for search, cart, checkout, auth flows as enumerated in `docs/testing.md`.
- Acceptance criteria: Tests run locally and in CI; coverage for critical flows present.
- Status: Not Started

---

### Task T18
- Task name: E2E test setup & flows
- Requirement/reference: E2E flows listed in `docs/testing.md` (guest→cart→login→checkout, OTP, admin flows)
- Description: Add E2E test framework (Playwright recommended) and implement critical end-to-end scenarios against staging.
- Dependencies: Playwright or Cypress, CI orchestration
- Files/modules expected to change: `e2e/playwright.config.ts` (or `cypress.json`), `e2e/tests/*`
- Tests required: E2E scenarios for guest flow, OTP login, order creation, and admin management.
- Acceptance criteria: E2E flows pass against a test/staging backend in CI.
- Status: Not Started

---

### Task T19
- Task name: Accessibility & responsive checks
- Requirement/reference: Accessibility and responsive validation at 375px and 1440px (`docs/frontend-spec.md`, `docs/testing.md`)
- Description: Integrate accessibility checks into unit/E2E tests and validate UI at the two target breakpoints.
- Dependencies: `axe-core` or Playwright a11y helpers
- Files/modules expected to change: Test suites and CI config
- Tests required: Axe/unit a11y checks and E2E a11y runs at both breakpoints.
- Acceptance criteria: No critical accessibility violations; UI validated at 375px and 1440px.
- Status: Not Started

---

### Task T20
- Task name: Security review & docs
- Requirement/reference: AGENTS.md security rules, `docs/testing.md` security checks
- Description: Execute security checklist across implemented features (no localStorage tokens, no secrets in bundles), document any API contract changes, and coordinate backend for migrations or contract updates.
- Dependencies: Completed feature implementations; security reviewers/approvers
- Files/modules expected to change: `SECURITY.md`, updated docs, any API contract docs if changes are necessary
- Tests required: Automated checks (scan for tokens in localStorage usage), manual security review sign-off
- Acceptance criteria: Security checklist passed; no tokens persisted insecurely; all API/DB changes documented and coordinated.
- Status: Not Started

---

Status legend: Not Started / In Progress / Completed

This plan maps directly to the specification documents; implementers should not change API contracts or database schemas without explicit coordination and documentation.
