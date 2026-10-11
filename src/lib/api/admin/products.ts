import { admin } from '../endpoints'
import { apiDelete, apiGet, apiPatch, apiPost } from '../client'

export interface AdminProduct {
  id: string
  name: string
  description?: string
  brand?: string
  category?: string
  price?: string | number
  stock?: number
  sku?: string
  discount?: number
  imageUrl?: string
  [key: string]: unknown
}

export interface ProductPageResponse {
  items: AdminProduct[]
  page?: number
  size?: number
  totalPages?: number
  total?: number
}

export interface ProductPayload {
  id?: string
  name: string
  sku?: string
  brand?: string
  category?: string
  description?: string
  price: string | number
  stock?: number
  discount?: number
  imageUrl?: string
}

function normalizeProductPage(payload: unknown): ProductPageResponse {
  const response = (payload ?? {}) as Record<string, unknown>
  const data =
    response.data && typeof response.data === 'object'
      ? (response.data as Record<string, unknown>)
      : response
  const items = Array.isArray(data.items)
    ? (data.items as AdminProduct[])
    : Array.isArray(data.products)
      ? (data.products as AdminProduct[])
      : Array.isArray(data.content)
        ? (data.content as AdminProduct[])
        : []

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

export async function listAdminProducts(): Promise<ProductPageResponse> {
  const payload = await apiGet<unknown>(admin.products.list)
  return normalizeProductPage(payload)
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  try {
    return await apiGet<AdminProduct>(admin.products.get(id))
  } catch {
    return null
  }
}

export async function createAdminProduct(payload: Partial<ProductPayload>): Promise<AdminProduct> {
  return apiPost<AdminProduct>(admin.products.create, payload)
}

export async function updateAdminProduct(id: string, payload: Partial<ProductPayload>): Promise<AdminProduct> {
  return apiPost<AdminProduct>(admin.products.update(id), payload)
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await apiDelete<void>(admin.products.delete(id))
}

export async function updateProductStock(id: string, stock: number): Promise<AdminProduct> {
  return apiPatch<AdminProduct>(admin.products.updateStock(id), { stock })
}

export async function updateProductDiscount(id: string, discount: number): Promise<AdminProduct> {
  return apiPatch<AdminProduct>(admin.products.updateDiscount(id), { discount })
}
