import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AdminLayout, AdminRoute } from '../admin'

describe('admin layout', () => {
  it('renders the admin shell and navigation', () => {
    render(
      <AdminLayout title="Admin dashboard">
        <div>Dashboard content</div>
      </AdminLayout>
    )

    expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument()
    expect(screen.getByText('Dashboard content')).toBeInTheDocument()
  })

  it('shows an access-denied state when the user is not an admin', () => {
    render(
      <AdminRoute isAdmin={false}>
        <div>Protected admin content</div>
      </AdminRoute>
    )

    expect(screen.getByText(/admin access required/i)).toBeInTheDocument()
    expect(screen.queryByText('Protected admin content')).not.toBeInTheDocument()
  })
})
