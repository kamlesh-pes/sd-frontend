import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { useAppStore } from './state/store'

export default function App() {
  const { cartDrawerOpen, searchQuery, selectedCategory, setCartDrawerOpen, setSearchQuery, setSelectedCategory } = useAppStore()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <main className="max-w-4xl mx-auto p-6">
          <h1 className="font-display text-2xl font-semibold">Sahastra Digital — Frontend</h1>
          <p className="mt-4 text-sm text-muted-foreground">Welcome — scaffold running.</p>

          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <button onClick={() => setCartDrawerOpen(!cartDrawerOpen)} className="w-fit rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
              {cartDrawerOpen ? 'Close cart drawer' : 'Open cart drawer'}
            </button>

            <input
              aria-label="Search products"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />

            <select
              aria-label="Select category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All categories</option>
              <option value="electronics">Electronics</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  )
}
