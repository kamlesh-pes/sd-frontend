import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ProductForm } from '../../../../components/admin/ProductForm'
import {
  createAdminProduct,
  deleteAdminProduct,
  listAdminProducts,
  updateProductDiscount,
  updateProductStock,
} from '../../../../lib/api/admin/products'

describe('Admin product CRUD', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders and submits the product form', async () => {
    const onSubmit = vi.fn()
    render(
      <ProductForm
        initialValues={{
          name: 'Laptop',
          sku: 'LAP-01',
          brandId: 'brand-acme',
          categoryId: 'category-electronics',
          description: 'Gaming laptop',
          price: '999.00',
          stock: '12',
          discount: '5',
        }}
        brands={[{ id: 'brand-acme', name: 'Acme', slug: 'acme' }]}
        categories={[{ id: 'category-electronics', name: 'Electronics', slug: 'electronics' }]}
        onSubmit={onSubmit}
      />
    )

    await userEvent.clear(screen.getByLabelText(/name/i))
    await userEvent.type(screen.getByLabelText(/name/i), 'Gaming Laptop')
    await userEvent.click(screen.getByRole('button', { name: /save product/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Gaming Laptop',
          sku: 'LAP-01',
          brandId: 'brand-acme',
          categoryId: 'category-electronics',
        })
      )
    })
  })

  it('submits the selected product image', async () => {
    const onSubmit = vi.fn()
    const image = new File(['image bytes'], 'product.jpg', { type: 'image/jpeg' })
    render(
      <ProductForm
        initialValues={{
          name: 'Laptop',
          sku: 'LAP-01',
          brandId: 'brand-acme',
          categoryId: 'category-electronics',
          description: 'Gaming laptop',
          price: '999.00',
        }}
        brands={[{ id: 'brand-acme', name: 'Acme', slug: 'acme' }]}
        categories={[{ id: 'category-electronics', name: 'Electronics', slug: 'electronics' }]}
        onSubmit={onSubmit}
      />
    )

    await userEvent.upload(screen.getByLabelText('Product image'), image)
    await userEvent.click(screen.getByRole('button', { name: /save product/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ image })
      )
    })
  })

  it('calls admin product endpoints with the correct URLs', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch' as never).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'p-1' }),
      headers: new Headers(),
    } as Response)

    await listAdminProducts()
    const image = new File(['image bytes'], 'monitor.jpg', { type: 'image/jpeg' })
    await createAdminProduct({
      sku: 'MON-01',
      name: 'Monitor',
      description: 'Office monitor',
      categoryId: 'category-electronics',
      brandId: 'brand-acme',
      basePrice: 199,
      stock: 5,
    }, image)
    await updateProductStock('p-1', 6)
    await updateProductDiscount('p-1', 10)
    await deleteAdminProduct('p-1')

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/admin/products',
      expect.objectContaining({ method: 'GET' })
    )
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/admin/products',
      expect.objectContaining({ method: 'POST' })
    )
    const createRequest = fetchMock.mock.calls[1][1] as { method?: string; body?: FormData }
    expect(createRequest?.method).toBe('POST')
    expect(createRequest?.body).toBeInstanceOf(FormData)
    const formData = createRequest?.body as FormData
    const productPart = formData.get('product') as Blob
    expect(productPart.type).toBe('application/json')
    const reader = new FileReader()
    const productJson = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsText(productPart)
    })
    expect(JSON.parse(productJson)).toEqual({
      sku: 'MON-01',
      name: 'Monitor',
      description: 'Office monitor',
      categoryId: 'category-electronics',
      brandId: 'brand-acme',
      basePrice: 199,
      stock: 5,
    })
    expect(formData.get('image')).toMatchObject({
      name: 'monitor.jpg',
      type: 'image/jpeg',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/admin/products/p-1/stock',
      expect.objectContaining({ method: 'PATCH' })
    )
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/admin/products/p-1/discount',
      expect.objectContaining({ method: 'PATCH' })
    )
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/admin/products/p-1',
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
