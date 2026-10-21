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
          {
            id: 'p1',
            name: 'Laptop Pro',
            categoryName: 'electronics',
            brandName: 'BrandX',
            effectivePrice: '1499.00',
            images: {
              primary: '/media/products/laptop-1200.webp',
              thumbnail: '/media/products/laptop-400.webp',
            },
          },
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

    expect(screen.getByText('electronics')).toBeInTheDocument()
    expect(screen.getByText('BrandX')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Laptop Pro' })).toHaveAttribute(
      'src',
      '/media/products/laptop-400.webp'
    )

    const input = screen.getByLabelText(/search products/i)
    expect(input).toBeInTheDocument()
  })
})
