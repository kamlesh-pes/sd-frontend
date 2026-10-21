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

  it('normalizes backend product card fields and keeps relative media paths', async () => {
    server.use(
      http.get('/api/v1/products', () =>
        HttpResponse.json({
          success: true,
          data: {
            totalElements: 1,
            totalPages: 1,
            size: 20,
            content: [
              {
                id: 'p-3',
                name: 'Mac book pro',
                categoryName: 'electronics',
                brandName: 'Apple',
                basePrice: 120000,
                effectivePrice: 117600,
                images: {
                  primary: '/media/products/product-1200.webp',
                  thumbnail: '/media/products/product-400.webp',
                },
              },
            ],
            number: 0,
          },
        })
      )
    )

    await expect(fetchProducts()).resolves.toMatchObject({
      items: [
        {
          category: 'electronics',
          brand: 'Apple',
          price: 117600,
          imageUrl: '/media/products/product-400.webp',
        },
      ],
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
