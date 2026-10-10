import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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

  it('renders and submits the product form', async () => {
    const onSubmit = vi.fn()
    render(
      <ProductForm
        initialValues={{
          name: 'Laptop',
          sku: 'LAP-01',
          brand: 'Acme',
          category: 'electronics',
          description: 'Gaming laptop',
          price: '999.00',
          stock: '12',
          discount: '5',
        }}
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
          brand: 'Acme',
          category: 'electronics',
        })
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
    await createAdminProduct({ name: 'Monitor', price: '199.00', stock: 5 })
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
