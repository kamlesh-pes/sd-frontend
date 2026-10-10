import { describe, it, expect } from 'vitest'
import { useAppStore } from '../store'

describe('app store', () => {
  it('starts with default UI state', () => {
    const state = useAppStore.getState()

    expect(state.cartDrawerOpen).toBe(false)
    expect(state.searchQuery).toBe('')
    expect(state.selectedCategory).toBe('all')
  })

  it('updates UI state through actions', () => {
    const { setSearchQuery, setSelectedCategory, setCartDrawerOpen, toggleCartDrawer } = useAppStore.getState()

    setSearchQuery('laptop')
    setSelectedCategory('electronics')
    setCartDrawerOpen(true)

    expect(useAppStore.getState().searchQuery).toBe('laptop')
    expect(useAppStore.getState().selectedCategory).toBe('electronics')
    expect(useAppStore.getState().cartDrawerOpen).toBe(true)

    toggleCartDrawer()
    expect(useAppStore.getState().cartDrawerOpen).toBe(false)
  })
})
