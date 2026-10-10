import { apiDelete, apiGet, apiPatch, apiPost } from './client'
import { cart } from './endpoints'
import type { GuestCartEntry } from '../persistence/guestCartStorage'

export interface CartItemPayload {
  productId: string
  name?: string
  quantity: number
  unitPrice?: string
}

export interface CartItemResponse extends CartItemPayload {
  id?: string
}

export async function getCart(): Promise<Record<string, unknown>> {
  return apiGet<Record<string, unknown>>(cart.get)
}

export async function addCartItem(item: CartItemPayload): Promise<CartItemResponse> {
  return apiPost<CartItemResponse>(cart.addItem, item)
}

export async function updateCartItem(itemId: string, payload: { quantity: number }): Promise<CartItemResponse> {
  return apiPatch<CartItemResponse>(cart.updateItem(itemId), payload)
}

export async function removeCartItem(itemId: string): Promise<void> {
  await apiDelete<void>(cart.removeItem(itemId))
}

export async function mergeGuestCartIntoServerCart(items: GuestCartEntry[]): Promise<void> {
  if (!items.length) {
    return
  }

  for (const item of items) {
    await addCartItem({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })
  }
}
