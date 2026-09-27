# Frontend API Contract

This document is derived from the backend implementation contract in `docs/openapi.yaml` and should be treated as the source of truth for all frontend API calls.

If this document and the OpenAPI file differ, the OpenAPI contract wins.

## Base URL

Local backend base URL:

`http://localhost:8080/api/v1`

All frontend requests should be routed under `/api/v1`.

## Authentication

### `POST /auth/login`
Authenticates a user using email + password.

Request body:
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

Schema reference:
- `LoginRequest`
- `email` required
- `password` required

## Products

### `GET /products`
Lists products with optional filtering.

Query parameters:
- `category` (string, optional)
- `brand` (string, optional)
- `page` (integer, optional, default `0`)
- `size` (integer, optional, default `20`)

Response:
- Product page payload returned by backend

### `GET /products/{id}`
Retrieves a single product by UUID.

Path parameter:
- `id` (string, UUID, required)

## Search

### `GET /search`
Searches products.

Query parameters:
- `q` (string, optional)
- `page` (integer, optional, default `0`)
- `size` (integer, optional, default `20`)

## Cart

### `GET /cart`
Retrieves the current cart payload from the backend.

## Orders

### `GET /orders`
Lists orders for the authenticated user or current context.

### `POST /orders`
Creates an order.

Request body:
```json
{
  "cartId": "<cart-id>",
  "idempotencyKey": "<optional-idempotency-key>"
}
```

Schema reference:
- `OrderRequest`
- `cartId` is required
- `idempotencyKey` is optional

## Error handling

The backend uses a standard error payload schema (`ApiError`).

```json
{
  "timestamp": "2025-01-01T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for request payload.",
  "path": "/api/v1/orders",
  "correlationId": "4f2c3de5-31b0-4f9a-9366-0be07eb16dd7",
  "details": [
    "email is required"
  ]
}
```

Frontend handling should:
- surface `message` to the user;
- log or trace `correlationId` for support/debugging;
- treat validation and business-rule failures as backend-authoritative;
- never rely on client-side values for prices, stock, totals, order status, or cancellation eligibility.

## Contract rule

All frontend API usage must align with `docs/openapi.yaml`. Any additional endpoint or payload not defined there is not part of the current backend contract unless the backend OpenAPI is updated first.
