import { describe, it, expect } from 'vitest'
import { auth, products, search, cart, orders, user, admin } from '../endpoints'

describe('Endpoints', () => {
  describe('auth', () => {
    it('exports auth endpoints', () => {
      expect(auth.register).toBe('/auth/register')
      expect(auth.login).toBe('/auth/login')
      expect(auth.logout).toBe('/auth/logout')
      expect(auth.refresh).toBe('/auth/refresh')
      expect(auth.otpRequest).toBe('/auth/otp/request')
      expect(auth.otpVerify).toBe('/auth/otp/verify')
      expect(auth.linkEmail).toBe('/users/me/link-email')
      expect(auth.linkMobile).toBe('/users/me/link-mobile')
    })
  })

  describe('products', () => {
    it('exports product endpoints', () => {
      expect(products.list).toBe('/products')
      expect(products.get('123')).toBe('/products/123')
    })
  })

  describe('search', () => {
    it('exports search endpoints with query encoding', () => {
      expect(search.search('laptop')).toBe('/search?q=laptop')
      expect(search.search('laptop pro')).toBe('/search?q=laptop%20pro')
      expect(search.suggest('lap')).toBe('/search/suggest?q=lap')
    })
  })

  describe('cart', () => {
    it('exports cart endpoints', () => {
      expect(cart.get).toBe('/cart')
      expect(cart.addItem).toBe('/cart/items')
      expect(cart.updateItem('item-1')).toBe('/cart/items/item-1')
      expect(cart.removeItem('item-1')).toBe('/cart/items/item-1')
    })
  })

  describe('orders', () => {
    it('exports order endpoints', () => {
      expect(orders.create).toBe('/orders')
      expect(orders.list).toBe('/orders')
      expect(orders.get('order-123')).toBe('/orders/order-123')
      expect(orders.cancel('order-123')).toBe('/orders/order-123/cancel')
      expect(orders.supportRequest('order-123')).toBe('/orders/order-123/support-request')
    })
  })

  describe('user', () => {
    it('exports user endpoints', () => {
      expect(user.me).toBe('/users/me')
      expect(user.addresses).toBe('/users/me/addresses')
      expect(user.createAddress).toBe('/users/me/addresses')
    })
  })

  describe('admin', () => {
    it('exports admin product endpoints', () => {
      expect(admin.products.create).toBe('/admin/products')
      expect(admin.products.list).toBe('/admin/products')
      expect(admin.products.get('product-1')).toBe('/admin/products/product-1')
      expect(admin.products.update('product-1')).toBe('/admin/products/product-1')
      expect(admin.products.delete('product-1')).toBe('/admin/products/product-1')
      expect(admin.products.updateStock('product-1')).toBe('/admin/products/product-1/stock')
      expect(admin.products.updateDiscount('product-1')).toBe(
        '/admin/products/product-1/discount'
      )
    })

    it('exports admin order endpoints', () => {
      expect(admin.orders.list).toBe('/admin/orders')
      expect(admin.orders.get('order-1')).toBe('/admin/orders/order-1')
    })

    it('exports admin utility endpoints', () => {
      expect(admin.reports).toBe('/admin/reports')
      expect(admin.audit).toBe('/admin/audit')
      expect(admin.supportRequests).toBe('/admin/support-requests')
    })
  })
})
