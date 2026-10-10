import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ProductsPage from '../ProductsPage'

describe('ProductsPage', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        items: [
          { id: 'p1', name: 'Laptop Pro', category: 'electronics', brand: 'BrandX', price: '1499.00' },
          { id: 'p2', name: 'Mechanical Keyboard', category: 'accessories', brand: 'BrandY', price: '89.99' },
        ],
        totalPages: 1,
        page: 0,
      }),
      headers: new Headers(),
    })
  })

  it('renders products fetched from the API and supports search input', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    render(
      <QueryClientProvider client={queryClient}>
        <ProductsPage />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/search products/i)
    expect(input).toBeInTheDocument()
  })
})
