import { apiGet } from './client'
import { products, search } from './endpoints'

export interface Product {
  id: string
  name: string
  description?: string
  brand?: string
  brandName?: string
  category?: string
  categoryName?: string
  price?: string | number
  basePrice?: string | number
  effectivePrice?: string | number
  imageUrl?: string
  images?: {
    primary?: string
    thumbnail?: string
  }
  stock?: number
  sku?: string
  [key: string]: unknown
}

export interface ProductPageResponse {
  items: Product[]
  page?: number
  size?: number
  totalPages?: number
  total?: number
}

export interface FetchProductsOptions {
  category?: string
  page?: number
  size?: number
}

export interface SearchProductsOptions extends FetchProductsOptions {
  query: string
}

function normalizeProduct(product: Product): Product {
  const imageUrl =
    product.imageUrl ??
    product.images?.thumbnail ??
    product.images?.primary

  return {
    ...product,
    category: product.category ?? product.categoryName,
    brand: product.brand ?? product.brandName,
    price: product.effectivePrice ?? product.price ?? product.basePrice,
    imageUrl,
  }
}

function normalizeProductPage(payload: unknown): ProductPageResponse {
  const response = (payload ?? {}) as Record<string, unknown>
  const data =
    response.data && typeof response.data === 'object'
      ? (response.data as Record<string, unknown>)
      : response

  const products = Array.isArray(data.items)
    ? (data.items as Product[])
    : Array.isArray(data.products)
      ? (data.products as Product[])
      : Array.isArray(data.content)
        ? (data.content as Product[])
        : []
  const items = products.map(normalizeProduct)

  return {
    items,
    page: typeof data.page === 'number' ? data.page : typeof data.number === 'number' ? data.number : 0,
    size: typeof data.size === 'number' ? data.size : items.length,
    totalPages: typeof data.totalPages === 'number' ? data.totalPages : 1,
    total:
      typeof data.total === 'number'
        ? data.total
        : typeof data.totalElements === 'number'
          ? data.totalElements
          : items.length,
  }
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<ProductPageResponse> {
  const { category, page = 0, size = 20 } = options
  const params = new URLSearchParams()

  if (category && category !== 'all') {
    params.set('category', category)
  }

  if (page !== undefined && page !== 0) {
    params.set('page', String(page))
  }

  if (size !== undefined && size !== 20) {
    params.set('size', String(size))
  }

  const endpoint = params.toString() ? `${products.list}?${params.toString()}` : products.list
  const data = await apiGet<unknown>(endpoint)
  return normalizeProductPage(data)
}

export async function searchProducts(options: SearchProductsOptions): Promise<ProductPageResponse> {
  const { query, page = 0, size = 20, category } = options
  const cleanQuery = query.trim()

  if (!cleanQuery) {
    return fetchProducts({ category, page, size })
  }

  const baseEndpoint = search.search(cleanQuery)
  const params = new URLSearchParams()

  if (page !== undefined && page !== 0) {
    params.set('page', String(page))
  }

  if (size !== undefined && size !== 20) {
    params.set('size', String(size))
  }

  const suffix = params.toString() ? `&${params.toString()}` : ''
  const data = await apiGet<unknown>(`${baseEndpoint}${suffix}`)
  return normalizeProductPage(data)
}
