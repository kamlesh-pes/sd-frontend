import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import ProductsPage from './pages/ProductsPage'
import { queryClient } from './lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsPage />
    </QueryClientProvider>
  )
}
