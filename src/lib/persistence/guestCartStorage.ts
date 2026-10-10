export const guestCartStorageKey = 'sd-guest-cart'

export interface GuestCartEntry {
  productId: string
  name: string
  quantity: number
  unitPrice: string
  imageUrl?: string
  sku?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function normalizeGuestCartEntry(value: unknown): GuestCartEntry | null {
  if (!isRecord(value)) {
    return null
  }

  const productId = typeof value.productId === 'string' ? value.productId.trim() : ''
  const name = typeof value.name === 'string' ? value.name.trim() : ''
  const unitPrice = typeof value.unitPrice === 'string' ? value.unitPrice.trim() : ''
  const quantity = Number(value.quantity)

  if (!productId || !name || !unitPrice || !Number.isFinite(quantity) || quantity <= 0) {
    return null
  }

  return {
    productId,
    name,
    quantity: Math.floor(quantity),
    unitPrice,
    imageUrl: typeof value.imageUrl === 'string' ? value.imageUrl : undefined,
    sku: typeof value.sku === 'string' ? value.sku : undefined,
  }
}

export function loadGuestCart(): GuestCartEntry[] {
  try {
    const raw = window.localStorage.getItem(guestCartStorageKey)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      window.localStorage.removeItem(guestCartStorageKey)
      return []
    }

    const items = parsed
      .map(normalizeGuestCartEntry)
      .filter((item): item is GuestCartEntry => item !== null)

    if (items.length !== parsed.length) {
      window.localStorage.setItem(guestCartStorageKey, JSON.stringify(items))
    }

    return items
  } catch {
    window.localStorage.removeItem(guestCartStorageKey)
    return []
  }
}

export function saveGuestCart(items: GuestCartEntry[]): void {
  const normalized = items
    .map(normalizeGuestCartEntry)
    .filter((item): item is GuestCartEntry => item !== null)

  window.localStorage.setItem(guestCartStorageKey, JSON.stringify(normalized))
}

export function clearGuestCart(): void {
  window.localStorage.removeItem(guestCartStorageKey)
}

export function mergeGuestCartWithServerCart(
  serverCart: GuestCartEntry[] = [],
  guestItems: GuestCartEntry[] = []
): GuestCartEntry[] {
  const merged = new Map<string, GuestCartEntry>()

  for (const item of serverCart) {
    const normalized = normalizeGuestCartEntry(item)
    if (!normalized) {
      continue
    }
    merged.set(normalized.productId, { ...normalized })
  }

  for (const item of guestItems) {
    const normalized = normalizeGuestCartEntry(item)
    if (!normalized) {
      continue
    }

    const existing = merged.get(normalized.productId)
    if (existing) {
      merged.set(normalized.productId, {
        ...existing,
        quantity: existing.quantity + normalized.quantity,
        unitPrice: existing.unitPrice || normalized.unitPrice,
      })
      continue
    }

    merged.set(normalized.productId, { ...normalized })
  }

  return Array.from(merged.values())
}
