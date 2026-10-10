import { apiGet, apiPost } from './client'
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

export interface OrderItem {
  id?: string
  name?: string
  quantity?: number
  unitPrice?: string
  thumbnailUrl?: string
}

export interface OrderResponse {
  id?: string
  orderId?: string
  status?: string
  total?: string
  cartId?: string
  createdAt?: string
  itemCount?: number
  items?: OrderItem[]
  shippingAddress?: Partial<CheckoutAddress>
  timeline?: string[]
  cancelEligible?: boolean
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

export async function listOrders(): Promise<OrderResponse[]> {
  return apiGet<OrderResponse[]>(orders.list)
}

export async function getOrder(orderId: string): Promise<OrderResponse> {
  return apiGet<OrderResponse>(orders.get(orderId))
}

export async function cancelOrder(orderId: string, reason: string): Promise<OrderResponse> {
  return apiPost<OrderResponse>(orders.cancel(orderId), { reason })
}

export async function createSupportRequest(orderId: string, message: string): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>(orders.supportRequest(orderId), { message })
}
