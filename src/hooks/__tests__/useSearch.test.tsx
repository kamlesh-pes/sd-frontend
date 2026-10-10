import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSearch } from '../useSearch'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockReset()
})

describe('useSearch', () => {
  it('loads products from the backend and respects the search query', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        items: [
          { id: 'p1', name: 'Laptop Pro', category: 'electronics', brand: 'BrandX', price: '1499.00' },
          { id: 'p2', name: 'Wireless Mouse', category: 'accessories', brand: 'BrandY', price: '39.99' },
        ],
        totalPages: 1,
        page: 0,
      }),
      headers: new Headers(),
    })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    const { result } = renderHook(() => useSearch({ query: 'laptop', category: 'all', page: 0, size: 20 }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.products).toHaveLength(2)
    expect(result.current.products[0].name).toBe('Laptop Pro')
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/search?q=laptop',
      expect.objectContaining({ method: 'GET' })
    )
  })
})
