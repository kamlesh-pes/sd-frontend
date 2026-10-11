import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import App from '../App'
import { server } from '../test/server'

function setAdminSession(role: string) {
  window.sessionStorage.setItem(
    'sd-auth-session',
    JSON.stringify({
      accessToken: 'test-token',
      user: { id: 'user-1', email: 'user@example.com', role },
    })
  )
}

beforeEach(() => {
  window.history.replaceState({}, '', '/')
  window.sessionStorage.clear()
})

it('renders the customer product page at the root route', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Search products' })).toBeInTheDocument()
})

it('renders admin product management at its route', async () => {
  window.history.replaceState({}, '', '/admin/products')
  setAdminSession('ROLE_CUSTOMER')
  server.use(
    http.get('/api/v1/auth/me', () =>
      HttpResponse.json({
        data: { id: 'user-1', email: 'admin@example.com', role: 'ROLE_ADMIN' },
      })
    )
  )
  render(<App />)

  expect(await screen.findByRole('button', { name: 'Add product' })).toBeInTheDocument()
  expect(screen.getByText('Inventory')).toBeInTheDocument()
})

it('denies customer access even when the editable session claims an admin role', async () => {
  window.history.replaceState({}, '', '/admin/products')
  setAdminSession('ROLE_ADMIN')
  render(<App />)

  expect(await screen.findByRole('heading', { name: 'Admin access required' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Add product' })).not.toBeInTheDocument()
  expect(screen.queryByText('Inventory')).not.toBeInTheDocument()
})

it('renders the admin orders route after backend role verification', async () => {
  window.history.replaceState({}, '', '/admin/orders')
  setAdminSession('ROLE_CUSTOMER')
  server.use(
    http.get('/api/v1/auth/me', () =>
      HttpResponse.json({
        data: { id: 'user-1', email: 'admin@example.com', role: 'ROLE_ADMIN' },
      })
    )
  )
  render(<App />)

  expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  expect(screen.queryByRole('textbox', { name: 'Search products' })).not.toBeInTheDocument()
  expect(screen.getByText('Dashboard data is not connected yet.')).toBeInTheDocument()
})
