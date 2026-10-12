import { apiGet, apiPost } from '../client'
import { admin } from '../endpoints'

export interface CatalogItem {
  id: string
  name: string
  slug: string
}

export interface CatalogNameRequest {
  name: string
  slug: string
}

type CatalogType = 'categories' | 'brands'

function unwrapData(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data?: unknown }).data
  }
  return payload
}

function parseCatalogItem(value: unknown): CatalogItem {
  if (!value || typeof value !== 'object') {
    throw new Error('The catalog response contained an invalid item.')
  }

  const item = value as Record<string, unknown>
  if (
    typeof item.id !== 'string' ||
    typeof item.name !== 'string' ||
    typeof item.slug !== 'string'
  ) {
    throw new Error('The catalog response contained an invalid item.')
  }

  return { id: item.id, name: item.name, slug: item.slug }
}

function parseCatalogList(payload: unknown): CatalogItem[] {
  const unwrapped = unwrapData(payload)
  const data =
    unwrapped && typeof unwrapped === 'object' && !Array.isArray(unwrapped)
      ? (unwrapped as Record<string, unknown>)
      : null
  const items = Array.isArray(unwrapped)
    ? unwrapped
    : data && Array.isArray(data.items)
      ? data.items
      : data && Array.isArray(data.content)
        ? data.content
        : null

  if (!items) {
    throw new Error('The catalog response did not contain a list.')
  }

  return items.map(parseCatalogItem)
}

function getCatalogEndpoint(type: CatalogType): string {
  return type === 'categories' ? admin.catalog.categories : admin.catalog.brands
}

export async function listAdminCatalog(type: CatalogType): Promise<CatalogItem[]> {
  const response = await apiGet<unknown>(getCatalogEndpoint(type))
  return parseCatalogList(response)
}

export async function createAdminCatalogItem(
  type: CatalogType,
  request: CatalogNameRequest
): Promise<CatalogItem> {
  const response = await apiPost<unknown>(getCatalogEndpoint(type), request)
  return parseCatalogItem(unwrapData(response))
}
