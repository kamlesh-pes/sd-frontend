import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const productCatalog = [
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

export const server = setupServer(
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

  http.post('/api/v1/admin/products', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const created = {
      id: `p-${Date.now()}`,
      name: String(body.name ?? 'New product'),
      sku: String(body.sku ?? 'NEW'),
      brand: String(body.brand ?? 'Unknown'),
      category: String(body.category ?? 'electronics'),
      description: String(body.description ?? ''),
      price: String(body.price ?? '0'),
      stock: Number(body.stock ?? 0),
      discount: Number(body.discount ?? 0),
      imageUrl: String(body.imageUrl ?? ''),
    }

    productCatalog.unshift(created)
    return HttpResponse.json(created, { status: 201 })
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
