# Sahastra Digital Frontend

React frontend for the Sahastra Digital e-commerce application.

## Local development

1. Start the Spring Boot backend on `http://localhost:8080`.
2. Install frontend dependencies with `npm install`.
3. Start the frontend with `npm run dev`.
4. Open `http://localhost:5173`.

Vite proxies requests under `/api/v1` to `http://127.0.0.1:8080`. For example, the product list request is `GET http://localhost:5173/api/v1/products` in the browser and is forwarded to the Spring Boot API at `http://127.0.0.1:8080/api/v1/products`.

## Pages and routes

- Customer product browsing: `http://localhost:5173/`
- Shared user/admin login and customer registration: `http://localhost:5173/login`
- Admin dashboard (defined route): `http://localhost:5173/admin`
- Admin product management (defined route): `http://localhost:5173/admin/products`
- Admin orders (defined route): `http://localhost:5173/admin/orders`
- Admin reports (defined route): `http://localhost:5173/admin/reports`

Admin routes are connected to the app: `/admin/products` shows product management, including the **Add product** form. Use **Log in** from the customer or admin page; the shared login returns to the previous page. The login page also lets customers create an account; registration starts email verification and does not automatically sign in. Admin API access requires an account authorized by the backend; the frontend route itself is not an authorization boundary.

## API

The frontend uses the `/api/v1` base path. Product browsing calls `GET /api/v1/products`; product search calls `GET /api/v1/search`; admin product creation uses `POST /api/v1/admin/products`. The backend remains authoritative for product data and validation.
