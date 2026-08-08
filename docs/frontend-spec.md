# Frontend Specification

## Product
Responsive electronics/computer e-commerce SPA.

## Customer experiences
- Product browsing/search
- Guest cart
- Login/register before checkout
- Email/password and mobile OTP
- Account linking
- Addresses
- Checkout
- Order history/detail
- Order status timeline
- Cancellation/support
- Admin product management, reports, audit, settings

## Search
Type-ahead, debounce, minimum 2 characters, full-text search over name/brand/category/description/SKU, fuzzy matching, “Did you mean?”, filters for category/brand/price/stock, sorting by relevance/price/newest, pagination.

## Cart
Guests can add/update/remove items. Server provides authoritative stock and totals. Merge guest cart into account after authentication.

## Checkout
Authentication required. Preserve checkout/cart context through login. Show/select shipping address and server-calculated summary. Submit idempotency key. Payment result is server-authoritative.

## Orders
List: ID, date, item count/thumbnail, total, status.
Detail: items, quantities, unit prices, shipping address, timeline:
`Ordered → Confirmed → Packed → Shipped → Out for Delivery → Delivered`
or `Cancelled`.

Customer cannot edit order status.

## Cancellation/support
Before 24 hours and before shipped: show self-cancel and collect reason.
After 24 hours or shipped: show Contact Support. Support request does not cancel the order.

## Admin
Separate `/admin/**` layout:
- Product CRUD
- Stock
- Discounts
- Orders
- Order/cancellation reports
- CSV export
- Audit log
- Support requests
- Session/security settings

## Components
```text
src/
├── components/
│   ├── ui/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── admin/
├── pages/ or routes/
└── styles/
```

Use shared primitives such as Button, Input, Badge, Card, Modal, Skeleton, ProductCard, ProductGrid, PriceTag, StockBadge, CartItemRow, CartSummary, AddressForm, OrderSummaryCard, AdminTable, ReportFilterBar, StatCard.

## Security
No localStorage tokens, no client secrets, no unnecessary PII exposure, and no UI-only authorization assumptions.
