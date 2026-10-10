import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import OrdersPage from '../OrdersPage'
import OrderDetailPage from '../OrderDetailPage'

describe('OrdersPage', () => {
  it('renders order list items with totals and status', () => {
    const orders = [
      {
        id: 'ord-1',
        createdAt: '2026-10-01T12:00:00Z',
        status: 'Packed',
        total: '179.98',
        itemCount: 2,
        items: [{ id: 'i-1', name: 'Keyboard', quantity: 1, unitPrice: '79.99' }],
      },
    ]

    render(<OrdersPage orders={orders} />)

    expect(screen.getByText('Order history')).toBeInTheDocument()
    expect(screen.getByText('ord-1')).toBeInTheDocument()
    expect(screen.getByText('Packed')).toBeInTheDocument()
    expect(screen.getByText('$179.98')).toBeInTheDocument()
  })
})

describe('OrderDetailPage', () => {
  it('renders order details and status timeline', () => {
    const order = {
      id: 'ord-2',
      createdAt: '2026-10-01T12:00:00Z',
      status: 'Shipped',
      total: '249.99',
      itemCount: 1,
      shippingAddress: {
        fullName: 'Ada Lovelace',
        addressLine1: '123 Main St',
        city: 'Boston',
        state: 'MA',
        postalCode: '02116',
        country: 'USA',
      },
      items: [{ id: 'i-2', name: 'Mouse', quantity: 1, unitPrice: '249.99' }],
      timeline: ['Ordered', 'Confirmed', 'Packed', 'Shipped'],
    }

    render(<OrderDetailPage order={order} />)

    expect(screen.getByText('Order ord-2')).toBeInTheDocument()
    expect(screen.getAllByText('Shipped').length).toBeGreaterThan(0)
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Ordered')).toBeInTheDocument()
    expect(screen.getByText('Packed')).toBeInTheDocument()
  })
})
