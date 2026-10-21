import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, ProductPageResponse, searchProducts } from '../lib/api/products'

export interface UseSearchOptions {
  query: string
  category?: string
  page?: number
  size?: number
  debounceMs?: number
}

export function useSearch({
  query,
  category = 'all',
  page = 0,
  size = 20,
  debounceMs = 250,
}: UseSearchOptions) {
  const normalizedQuery = query.trim()
  const [debouncedQuery, setDebouncedQuery] = useState(normalizedQuery)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(normalizedQuery)
    }, debounceMs)

    return () => window.clearTimeout(timeout)
  }, [normalizedQuery, debounceMs])

  const result = useQuery<ProductPageResponse>({
    queryKey: ['products', { query: debouncedQuery, category, page, size }],
    queryFn: async () => {
      if (!debouncedQuery) {
        return fetchProducts({ category, page, size })
      }

      return searchProducts({ query: debouncedQuery, category, page, size })
    },
    staleTime: 30_000,
  })

  return {
    products: result.data?.items ?? [],
    totalPages: result.data?.totalPages ?? 1,
    page: result.data?.page ?? page,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  }
}
