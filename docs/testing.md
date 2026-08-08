# Frontend Testing

Use Vitest + React Testing Library where applicable.

Test search, debounce, filters, pagination, product display, guest cart, cart merge, checkout redirect/return, address selection, order timeline, cancellation/support UI, admin UI, and API error handling.

Validate responsive behavior at 375px and 1440px.

Security checks: no localStorage tokens, no secrets in bundles, no unnecessary PII, admin UI does not replace backend authorization.

E2E flows should cover guest browse → cart → login → checkout, OTP login, typo search, order history/detail, cancellation/support, admin product management, and reports/CSV.
