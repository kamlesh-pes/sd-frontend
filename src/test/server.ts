import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const productCatalog: Array<{
  id: string
  name: string
  sku: string
  brand?: string
  category?: string
  description: string
  price: string
  stock: number
  discount: number
  brandId?: string
  categoryId?: string
  imageUrl?: string
}> = [
  {
    id: 'p-100',
    name: 'Laptop Pro',
    sku: 'LAP-100',
    brand: 'Acme',
    category: 'electronics',
    description: 'Performance laptop for work and travel',
    price: '1499.00',
    stock: 12,
    discount: 5,
  },
  {
    id: 'p-101',
    name: 'Wireless Mouse',
    sku: 'MOU-200',
    brand: 'Acme',
    category: 'accessories',
    description: 'Compact wireless mouse',
    price: '39.99',
    stock: 38,
    discount: 0,
  },
]

const categoryCatalog = [
  { id: 'category-electronics', name: 'Electronics', slug: 'electronics' },
]

const brandCatalog = [
  { id: 'brand-acme', name: 'Acme', slug: 'acme' },
]

function readFileText(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export const server = setupServer(
  http.get('/api/v1/auth/me', () => {
    return HttpResponse.json({
      data: { id: 'user-1', email: 'user@example.com', role: 'ROLE_CUSTOMER' },
    })
  }),

  http.get('/api/v1/products', () => {
    return HttpResponse.json({
      items: productCatalog,
      page: 0,
      size: 20,
      totalPages: 1,
      total: productCatalog.length,
    })
  }),

  http.get('/api/v1/search', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''
    const matches = productCatalog.filter((product) => product.name.toLowerCase().includes(q.toLowerCase()))

    return HttpResponse.json({
      items: matches,
      page: 0,
      size: 20,
      totalPages: 1,
      total: matches.length,
    })
  }),

  http.get('/api/v1/admin/products', () => {
    return HttpResponse.json({
      items: productCatalog,
      page: 0,
      size: 20,
      totalPages: 1,
      total: productCatalog.length,
    })
  }),

  http.get('/api/v1/admin/catalog/categories', () => {
    return HttpResponse.json({ success: true, data: categoryCatalog })
  }),

  http.get('/api/v1/admin/catalog/brands', () => {
    return HttpResponse.json({ success: true, data: brandCatalog })
  }),

  http.post('/api/v1/admin/catalog/categories', async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string }
    const created = { id: `category-${Date.now()}`, ...body }
    categoryCatalog.push(created)
    return HttpResponse.json({ success: true, data: created }, { status: 201 })
  }),

  http.post('/api/v1/admin/catalog/brands', async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string }
    const created = { id: `brand-${Date.now()}`, ...body }
    brandCatalog.push(created)
    return HttpResponse.json({ success: true, data: created }, { status: 201 })
  }),

  http.post('/api/v1/admin/products', async ({ request }) => {
    const formData = await request.formData()
    const productPart = formData.get('product')
    if (!productPart || typeof productPart === 'string') {
      return HttpResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Product part is required', correlationId: 'abc' } },
        { status: 400 }
      )
    }
    const body = JSON.parse(await readFileText(productPart)) as Record<string, unknown>
    const imagePart = formData.get('image')
    const created = {
      id: `p-${Date.now()}`,
      name: String(body.name ?? 'New product'),
      sku: String(body.sku ?? 'NEW'),
      brandId: String(body.brandId ?? ''),
      categoryId: String(body.categoryId ?? ''),
      description: String(body.description ?? ''),
      price: String(body.basePrice ?? '0'),
      stock: Number(body.stock ?? 0),
      discount: Number(body.discountValue ?? 0),
      imageUrl: imagePart && typeof imagePart !== 'string'
        ? `/uploads/${imagePart.name}`
        : '',
    }

    productCatalog.unshift(created)
    return HttpResponse.json({ success: true, data: created }, { status: 201 })
  }),

  http.patch('/api/v1/admin/products/:id/stock', async ({ params, request }) => {
    const payload = (await request.json()) as Record<string, unknown>
    const index = productCatalog.findIndex((product) => product.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Product not found', correlationId: 'abc' } }, { status: 404 })
    }

    productCatalog[index] = { ...productCatalog[index], stock: Number(payload.stock ?? 0) }
    return HttpResponse.json(productCatalog[index])
  }),

  http.patch('/api/v1/admin/products/:id/discount', async ({ params, request }) => {
    const payload = (await request.json()) as Record<string, unknown>
    const index = productCatalog.findIndex((product) => product.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Product not found', correlationId: 'abc' } }, { status: 404 })
    }

    productCatalog[index] = { ...productCatalog[index], discount: Number(payload.discount ?? 0) }
    return HttpResponse.json(productCatalog[index])
  }),

  http.delete('/api/v1/admin/products/:id', ({ params }) => {
    const index = productCatalog.findIndex((product) => product.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Product not found', correlationId: 'abc' } }, { status: 404 })
    }

    productCatalog.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/v1/admin/products/:id', async ({ params, request }) => {
    const payload = (await request.json()) as Record<string, unknown>
    const index = productCatalog.findIndex((product) => product.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Product not found', correlationId: 'abc' } }, { status: 404 })
    }

    productCatalog[index] = {
      ...productCatalog[index],
      name: String(payload.name ?? productCatalog[index].name),
      sku: String(payload.sku ?? productCatalog[index].sku),
      brand: String(payload.brand ?? productCatalog[index].brand),
      category: String(payload.category ?? productCatalog[index].category),
      description: String(payload.description ?? productCatalog[index].description ?? ''),
      price: String(payload.price ?? productCatalog[index].price ?? '0'),
      stock: Number(payload.stock ?? productCatalog[index].stock ?? 0),
      discount: Number(payload.discount ?? productCatalog[index].discount ?? 0),
      imageUrl: String(payload.imageUrl ?? productCatalog[index].imageUrl ?? ''),
    }

    return HttpResponse.json(productCatalog[index])
  })
)
