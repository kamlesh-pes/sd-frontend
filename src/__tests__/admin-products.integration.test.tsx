import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import ProductManagementPage from '../pages/admin/products/ProductManagementPage'
import { server } from '../test/server'

describe('Admin product management integration', () => {
  it('loads products and shows the admin inventory', async () => {
    render(<ProductManagementPage />)

    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument()
  })

  it('opens the create product form', async () => {
    render(<ProductManagementPage />)

    await userEvent.click(screen.getByRole('button', { name: /add product/i }))

    expect(screen.getByRole('heading', { name: /create product/i })).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: 'Electronics' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Acme' })).toBeTruthy()
  })

  it('creates category and brand entries for the product selectors', async () => {
    const categories = [{ id: 'cat-electronics', name: 'Electronics', slug: 'electronics' }]
    const brands = [{ id: 'brand-acme', name: 'Acme', slug: 'acme' }]
    server.use(
      http.get('/api/v1/admin/catalog/categories', () =>
        HttpResponse.json({ success: true, data: categories })
      ),
      http.get('/api/v1/admin/catalog/brands', () =>
        HttpResponse.json({ success: true, data: brands })
      ),
      http.post('/api/v1/admin/catalog/categories', async ({ request }) => {
        const item = { id: 'cat-home', ...(await request.json() as { name: string; slug: string }) }
        categories.push(item)
        return HttpResponse.json({ success: true, data: item }, { status: 201 })
      }),
      http.post('/api/v1/admin/catalog/brands', async ({ request }) => {
        const item = { id: 'brand-example', ...(await request.json() as { name: string; slug: string }) }
        brands.push(item)
        return HttpResponse.json({ success: true, data: item }, { status: 201 })
      })
    )

    render(<ProductManagementPage />)

    await userEvent.type(screen.getByLabelText('Category name'), 'Home')
    await userEvent.type(screen.getByLabelText('Slug', { selector: 'input#new-category-slug' }), 'home')
    await userEvent.click(screen.getByRole('button', { name: 'Create category' }))
    expect((await screen.findByRole('status')).textContent).toContain('Category created.')

    await userEvent.type(screen.getByLabelText('Brand name'), 'Example Brand')
    await userEvent.type(screen.getByLabelText('Slug', { selector: 'input#new-brand-slug' }), 'example-brand')
    await userEvent.click(screen.getByRole('button', { name: 'Create brand' }))
    expect((await screen.findByRole('status')).textContent).toContain('Brand created.')

    await userEvent.click(screen.getByRole('button', { name: /add product/i }))
    expect(await screen.findByRole('option', { name: 'Home' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Example Brand' })).toBeTruthy()
    await userEvent.selectOptions(screen.getByLabelText('Category'), screen.getByRole('option', { name: 'Home' }))
    await userEvent.selectOptions(screen.getByLabelText('Brand'), screen.getByRole('option', { name: 'Example Brand' }))
    expect((screen.getByLabelText('Category') as HTMLSelectElement).value).toBe('cat-home')
    expect((screen.getByLabelText('Brand') as HTMLSelectElement).value).toBe('brand-example')
  })
})
