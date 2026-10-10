# Security review

This review confirms the frontend remains aligned with the project security rules in AGENTS.md and the API contract.

## Checklist

- Authentication tokens are stored in sessionStorage, not localStorage.
- No secrets or private keys are embedded in frontend code or bundled config.
- Admin access remains UX-only in the UI; backend authorization remains the authoritative enforcement point.
- API data is treated as untrusted input; validation and business rules remain server-authoritative.
- Guest cart data is persisted locally only as non-sensitive cart state, not as auth/session data.
- No API contract or DB schema changes were required for the features implemented in this milestone.

## Verification summary

- Auth session persistence is handled in `src/lib/auth/session.ts` using `window.sessionStorage`.
- The session helper tests assert that auth tokens are not written to `localStorage`.
- The admin guard in `src/pages/admin/index.tsx` clearly indicates that backend authorization is enforced server-side.
- The app uses the `/api/v1` contract and does not hardcode private credentials or auth secrets in the client bundle.

## Contract status

No backend API or database schema changes were introduced by this task. If future admin or payment workflows require additional endpoints or data, those changes must be documented in the OpenAPI contract before frontend implementation.
