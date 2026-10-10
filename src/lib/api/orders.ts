import { apiPost } from './client'
import { orders } from './endpoints'

export interface CheckoutAddress {
  fullName: string
  email: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderResponse {
  id?: string
  orderId?: string
  status?: string
  total?: string
  cartId?: string
  [key: string]: unknown
}

export function generateIdempotencyKey(prefix = 'checkout'): string {
  const randomValue =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return `${prefix}-${randomValue}`
}

export async function createOrder(
  cartId: string,
  idempotencyKey: string = generateIdempotencyKey()
): Promise<OrderResponse> {
  return apiPost<OrderResponse>(orders.create, { cartId, idempotencyKey }, { idempotencyKey })
}
