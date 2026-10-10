import { create } from 'zustand'
import {
  clearGuestCart,
  loadGuestCart,
  mergeGuestCartWithServerCart,
  saveGuestCart,
  type GuestCartEntry,
} from '../lib/persistence/guestCartStorage'

export type { GuestCartEntry }

export interface GuestCartState {
  items: GuestCartEntry[]
  addItem: (item: GuestCartEntry) => void
  updateItemQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  replaceItems: (items: GuestCartEntry[]) => void
  mergeWithServerCart: (serverCart: GuestCartEntry[]) => void
  itemCount: () => number
  subtotal: () => string
}

export const guestCartStore = create<GuestCartState>((set, get) => ({
  items: loadGuestCart(),
  addItem: (item: GuestCartEntry) => {
    const normalizedItem = {
      ...item,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    }

    set((state) => {
      const existingIndex = state.items.findIndex((entry) => entry.productId === normalizedItem.productId)
      const nextItems = [...state.items]

      if (existingIndex >= 0) {
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: nextItems[existingIndex].quantity + normalizedItem.quantity,
          unitPrice: nextItems[existingIndex].unitPrice || normalizedItem.unitPrice,
        }
      } else {
        nextItems.push(normalizedItem)
      }

      saveGuestCart(nextItems)
      return { items: nextItems }
    })
  },
  updateItemQuantity: (productId: string, quantity: number) => {
    const nextQuantity = Math.max(0, Math.floor(Number(quantity) || 0))

    set((state) => {
      const nextItems = state.items
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: nextQuantity }
            : item
        )
        .filter((item) => item.quantity > 0)

      saveGuestCart(nextItems)
      return { items: nextItems }
    })
  },
  removeItem: (productId: string) => {
    set((state) => {
      const nextItems = state.items.filter((item) => item.productId !== productId)
      saveGuestCart(nextItems)
      return { items: nextItems }
    })
  },
  clear: () => {
    clearGuestCart()
    set({ items: [] })
  },
  replaceItems: (items: GuestCartEntry[]) => {
    const nextItems = items.map((item) => ({
      ...item,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    }))

    saveGuestCart(nextItems)
    set({ items: nextItems })
  },
  mergeWithServerCart: (serverCart: GuestCartEntry[]) => {
    const merged = mergeGuestCartWithServerCart(serverCart, get().items)
    saveGuestCart(merged)
    set({ items: merged })
  },
  itemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
  subtotal: () => get().items.reduce((total, item) => {
    const value = Number.parseFloat(item.unitPrice)
    return total + (Number.isFinite(value) ? value * item.quantity : 0)
  }, 0).toFixed(2),
}))

export { mergeGuestCartWithServerCart }
