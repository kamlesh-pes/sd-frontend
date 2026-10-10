import { beforeEach, describe, expect, it } from 'vitest'
import { guestCartStore, mergeGuestCartWithServerCart } from '../guestCart'
import { loadGuestCart } from '../../lib/persistence/guestCartStorage'

describe('guest cart state', () => {
  beforeEach(() => {
    window.localStorage.clear()
    guestCartStore.getState().clear()
  })

  it('adds, updates, and removes guest cart items', () => {
    const { addItem, updateItemQuantity, removeItem } = guestCartStore.getState()

    addItem({
      productId: 'product-1',
      name: 'Mechanical Keyboard',
      quantity: 1,
      unitPrice: '79.00',
    })

    expect(guestCartStore.getState().items).toHaveLength(1)
    expect(guestCartStore.getState().items[0].quantity).toBe(1)

    updateItemQuantity('product-1', 3)
    expect(guestCartStore.getState().items[0].quantity).toBe(3)

    removeItem('product-1')
    expect(guestCartStore.getState().items).toHaveLength(0)
  })

  it('persists guest cart entries in local storage for reloads', () => {
    guestCartStore.getState().addItem({
      productId: 'product-2',
      name: 'Wireless Mouse',
      quantity: 2,
      unitPrice: '29.99',
    })

    expect(loadGuestCart()).toHaveLength(1)
    expect(loadGuestCart()[0]).toMatchObject({
      productId: 'product-2',
      quantity: 2,
      name: 'Wireless Mouse',
      unitPrice: '29.99',
    })

    guestCartStore.getState().clear()
    expect(loadGuestCart()).toEqual([])
  })

  it('merges guest items with server cart without duplicating product ids', () => {
    const serverCart = [
      {
        productId: 'product-1',
        name: 'Keyboard',
        quantity: 2,
        unitPrice: '79.00',
      },
    ]

    const guestItems = [
      {
        productId: 'product-1',
        name: 'Keyboard',
        quantity: 1,
        unitPrice: '79.00',
      },
      {
        productId: 'product-3',
        name: 'Monitor',
        quantity: 1,
        unitPrice: '249.99',
      },
    ]

    expect(mergeGuestCartWithServerCart(serverCart, guestItems)).toEqual([
      {
        productId: 'product-1',
        name: 'Keyboard',
        quantity: 3,
        unitPrice: '79.00',
      },
      {
        productId: 'product-3',
        name: 'Monitor',
        quantity: 1,
        unitPrice: '249.99',
      },
    ])
  })
})
