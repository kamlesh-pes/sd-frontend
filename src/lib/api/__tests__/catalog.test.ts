import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { createAdminCatalogItem, listAdminCatalog } from '../admin/catalog'
import { server } from '../../../test/server'

describe('admin catalog API', () => {
  it('loads categories and brands from the standard response envelope', async () => {
    server.use(
      http.get('/api/v1/admin/catalog/categories', () =>
        HttpResponse.json({
          success: true,
          data: [{ id: 'cat-1', name: 'Home', slug: 'home' }],
        })
      ),
      http.get('/api/v1/admin/catalog/brands', () =>
        HttpResponse.json({
          success: true,
          data: [{ id: 'brand-1', name: 'Example Brand', slug: 'example-brand' }],
        })
      )
    )

    await expect(listAdminCatalog('categories')).resolves.toEqual([
      { id: 'cat-1', name: 'Home', slug: 'home' },
    ])
    await expect(listAdminCatalog('brands')).resolves.toEqual([
      { id: 'brand-1', name: 'Example Brand', slug: 'example-brand' },
    ])
  })

  it('creates catalog items with the required name and slug fields', async () => {
    let postedBody: unknown
    server.use(
      http.post('/api/v1/admin/catalog/categories', async ({ request }) => {
        postedBody = await request.json()
        return HttpResponse.json(
          { success: true, data: { id: 'cat-2', name: 'Kitchen', slug: 'kitchen' } },
          { status: 201 }
        )
      })
    )

    await expect(createAdminCatalogItem('categories', { name: 'Kitchen', slug: 'kitchen' })).resolves.toEqual({
      id: 'cat-2',
      name: 'Kitchen',
      slug: 'kitchen',
    })
    expect(postedBody).toEqual({ name: 'Kitchen', slug: 'kitchen' })
  })
})
