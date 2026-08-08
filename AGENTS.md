# Sahastra Digital Frontend — AI Agent Instructions

Read `docs/frontend-spec.md`, `docs/api-contract.md`, and `docs/testing.md` before relevant work.

## Stack
React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui/Radix, TanStack Query, Zustand or Redux Toolkit.

## Rules
- Backend is authoritative for auth, authorization, prices, discounts, stock, totals, payment state, cancellation eligibility, and order status.
- Never store authentication tokens in localStorage.
- Never expose secrets in frontend code or bundled configuration.
- UI route guards are UX only; backend authorization is mandatory.
- Preserve and merge guest carts after authentication.
- Use `/api/v1`.
- Build reusable shared components before composing pages.
- Centralize design tokens; do not duplicate styling.
- Treat API data as untrusted input.
- Treat money as exact decimal/string data; never use JS floating-point arithmetic for authoritative totals.
- Do not display or expose unnecessary PII.

## Component structure
`components/ui`, `components/product`, `components/cart`, `components/checkout`, `components/admin`, and `pages/routes`.

Repeated UI must be reusable. Pages should compose components rather than duplicate markup.

## UX
Mobile-first. Validate at 375px and 1440px. Use lazy-loaded images, debounced search, pagination, accessible forms/dialogs, keyboard navigation, and clear error states.

## Checkout
Guests may browse/search/cart but cannot create orders. Preserve cart during login/register and return to checkout. Submit the backend-required idempotency key. Never submit client-authoritative totals.

## Admin
Use `/admin/**`. Admin UI is not a replacement for backend `ROLE_ADMIN` enforcement.

## Done
Implement behavior, tests, responsive/accessibility checks, and update docs when API or user-visible contracts change.
