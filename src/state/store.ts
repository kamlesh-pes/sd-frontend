import { create } from 'zustand'

export interface AppStoreState {
  cartDrawerOpen: boolean
  searchQuery: string
  selectedCategory: string
  setCartDrawerOpen: (open: boolean) => void
  toggleCartDrawer: () => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  resetFilters: () => void
}

export const useAppStore = create<AppStoreState>((set) => ({
  cartDrawerOpen: false,
  searchQuery: '',
  selectedCategory: 'all',
  setCartDrawerOpen: (open: boolean) => set({ cartDrawerOpen: open }),
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  resetFilters: () => set({ searchQuery: '', selectedCategory: 'all' }),
}))
