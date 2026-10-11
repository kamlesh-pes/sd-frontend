import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { listAdminProducts } from '../admin/products'
import { fetchProducts } from '../products'
import { server } from '../../../test/server'

describe('product API response handling', () => {
  it('reads products from the backend data envelope and Spring page payload', async () => {
    server.use(
      http.get('/api/v1/products', () =>
        HttpResponse.json({
          success: true,
          data: {
            totalElements: 1,
            totalPages: 1,
            size: 20,
            content: [{ id: 'p-1', name: 'Backend Laptop' }],
            number: 0,
          },
        })
      )
    )

    await expect(fetchProducts()).resolves.toMatchObject({
      items: [{ id: 'p-1', name: 'Backend Laptop' }],
      page: 0,
      size: 20,
      total: 1,
      totalPages: 1,
    })
  })

  it('reads admin products from the backend data envelope', async () => {
    server.use(
      http.get('/api/v1/admin/products', () =>
        HttpResponse.json({
          success: true,
          data: {
            totalElements: 1,
            totalPages: 1,
            size: 20,
            content: [{ id: 'p-2', name: 'Admin Laptop' }],
            number: 0,
          },
        })
      )
    )

    await expect(listAdminProducts()).resolves.toMatchObject({
      items: [{ id: 'p-2', name: 'Admin Laptop' }],
      total: 1,
    })
  })
})
