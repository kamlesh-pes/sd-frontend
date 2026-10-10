export { apiRequest, apiGet, apiPost, apiPatch, apiPut, apiDelete, ApiClientError } from './client'
export { createOrder, generateIdempotencyKey, listOrders, getOrder, cancelOrder, createSupportRequest } from './orders'
export {
  listAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateProductStock,
  updateProductDiscount,
} from './admin'
export type { AdminProduct, ProductPageResponse, ProductPayload } from './admin'
export type { CheckoutAddress, OrderItem, OrderResponse } from './orders'
export type { ApiError, ErrorResponse, RequestOptions, ApiResponse } from './types'
export * as endpoints from './endpoints'
