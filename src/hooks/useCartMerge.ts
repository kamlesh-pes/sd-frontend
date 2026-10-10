import { useCallback } from 'react'
import { mergeGuestCartIntoServerCart } from '../lib/api/cart'
import { guestCartStore } from '../state/guestCart'

export function useCartMerge() {
  const mergeGuestCart = useCallback(async (): Promise<boolean> => {
    const items = guestCartStore.getState().items

    if (!items.length) {
      return false
    }

    try {
      await mergeGuestCartIntoServerCart(items)
      guestCartStore.getState().clear()
      return true
    } catch {
      return false
    }
  }, [])

  return { mergeGuestCart }
}
