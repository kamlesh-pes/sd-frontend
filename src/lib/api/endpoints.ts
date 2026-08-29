/**
 * Endpoint definitions for the API contract
 * Use these constants instead of hardcoding paths
 */

// Auth endpoints
export const auth = {
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  otpRequest: '/auth/otp/request',
  otpVerify: '/auth/otp/verify',
  linkEmail: '/users/me/link-email',
  linkMobile: '/users/me/link-mobile',
}

// Public product endpoints
export const products = {
  list: '/products',
  get: (id: string) => `/products/${id}`,
}

// Search endpoints
export const search = {
  search: (q: string) => `/search?q=${encodeURIComponent(q)}`,
  suggest: (q: string) => `/search/suggest?q=${encodeURIComponent(q)}`,
}

// Cart endpoints
export const cart = {
  get: '/cart',
  addItem: '/cart/items',
  updateItem: (itemId: string) => `/cart/items/${itemId}`,
  removeItem: (itemId: string) => `/cart/items/${itemId}`,
}

// Orders endpoints
export const orders = {
  create: '/orders',
  list: '/orders',
  get: (id: string) => `/orders/${id}`,
  cancel: (id: string) => `/orders/${id}/cancel`,
  supportRequest: (id: string) => `/orders/${id}/support-request`,
}

// User endpoints
export const user = {
  me: '/users/me',
  addresses: '/users/me/addresses',
  createAddress: '/users/me/addresses',
}

// Admin endpoints
export const admin = {
  products: {
    create: '/admin/products',
    list: '/admin/products',
    get: (id: string) => `/admin/products/${id}`,
    update: (id: string) => `/admin/products/${id}`,
    delete: (id: string) => `/admin/products/${id}`,
    updateStock: (id: string) => `/admin/products/${id}/stock`,
    updateDiscount: (id: string) => `/admin/products/${id}/discount`,
  },
  orders: {
    list: '/admin/orders',
    get: (id: string) => `/admin/orders/${id}`,
  },
  reports: '/admin/reports',
  audit: '/admin/audit',
  supportRequests: '/admin/support-requests',
}
