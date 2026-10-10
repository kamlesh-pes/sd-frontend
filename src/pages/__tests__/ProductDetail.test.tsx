import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ProductDetail from '../ProductDetail'

describe('ProductDetail', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: 'p1',
        name: 'Laptop Pro',
        brand: 'BrandX',
        category: 'electronics',
        description: 'A premium laptop for work and play.',
        price: '1499.00',
        stock: 8,
      }),
      headers: new Headers(),
    })
  })

  it('renders product details and add-to-cart action', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    render(
      <QueryClientProvider client={queryClient}>
        <ProductDetail productId="p1" />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
    })

    expect(screen.getByText('A premium laptop for work and play.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })
})
