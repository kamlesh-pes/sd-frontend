# Frontend API Contract

Base path: `/api/v1`

## Auth
`POST /auth/register`, `/auth/login`, `/auth/otp/request`, `/auth/otp/verify`, `/auth/refresh`, `/auth/logout`, `/users/me/link-email`, `/users/me/link-mobile`

## Public
`GET /products`, `GET /products/{id}`, `GET /search?q=...`, `GET /search/suggest?q=...`

## Cart
`GET /cart`, `POST /cart/items`, `PATCH /cart/items/{itemId}`, `DELETE /cart/items/{itemId}`

## Orders
`POST /orders`, `GET /orders`, `GET /orders/{id}`, `POST /orders/{id}/cancel`, `POST /orders/{id}/support-request`

Order creation requires authentication and an idempotency key.

## User
`GET /users/me`, `PATCH /users/me`, `GET /users/me/addresses`, `POST /users/me/addresses`

## Admin
`POST/PUT/DELETE /admin/products...`, `PATCH /admin/products/{id}/stock`, `PUT /admin/products/{id}/discount`, admin orders, reports, exports, audit log, support requests, and session settings.

All admin APIs require `ROLE_ADMIN`.

## Error
```json
{"error":{"code":"ERROR_CODE","message":"Human-readable message","correlationId":"request-id"}}
```

Never treat client price, stock, order status, cancellation eligibility, or timestamps as authoritative.
