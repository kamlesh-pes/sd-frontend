import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ProductManagementPage from '../pages/admin/products/ProductManagementPage'

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
  })
})
