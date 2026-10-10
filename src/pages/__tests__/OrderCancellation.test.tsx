import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import OrderDetailPage from '../OrderDetailPage'

const mockCancelOrder = vi.fn()
const mockSupportRequest = vi.fn()

vi.mock('../../lib/api/orders', () => ({
  cancelOrder: (...args: unknown[]) => mockCancelOrder(...args),
  createSupportRequest: (...args: unknown[]) => mockSupportRequest(...args),
}))

describe('Order cancellation and support UI', () => {
  beforeEach(() => {
    mockCancelOrder.mockReset()
    mockSupportRequest.mockReset()
  })

  it('shows cancel option when the order is still cancellable and submits the cancellation reason', async () => {
    const user = userEvent.setup()
    mockCancelOrder.mockResolvedValue({ id: 'ord-100', status: 'Cancelled' })

    render(
      <OrderDetailPage
        order={{
          id: 'ord-100',
          createdAt: '2026-10-01T12:00:00Z',
          status: 'Confirmed',
          total: '49.99',
          itemCount: 1,
          items: [{ id: 'i-1', name: 'Headphones', quantity: 1, unitPrice: '49.99' }],
          timeline: ['Ordered', 'Confirmed'],
          cancelEligible: true,
        }}
      />
    )

    await user.type(screen.getByLabelText(/cancel reason/i), 'Changed my mind')
    await user.click(screen.getByRole('button', { name: /cancel order/i }))

    expect(mockCancelOrder).toHaveBeenCalledWith('ord-100', 'Changed my mind')
    expect(screen.getByText(/order cancelled/i)).toBeInTheDocument()
  })

  it('shows support option when the order is no longer cancellable', async () => {
    const user = userEvent.setup()
    mockSupportRequest.mockResolvedValue({ ok: true })

    render(
      <OrderDetailPage
        order={{
          id: 'ord-101',
          createdAt: '2026-10-01T12:00:00Z',
          status: 'Shipped',
          total: '49.99',
          itemCount: 1,
          items: [{ id: 'i-2', name: 'Headphones', quantity: 1, unitPrice: '49.99' }],
          timeline: ['Ordered', 'Confirmed', 'Packed', 'Shipped'],
          cancelEligible: false,
        }}
      />
    )

    await user.type(screen.getByLabelText(/support message/i), 'Need tracking help')
    await user.click(screen.getByRole('button', { name: /contact support/i }))

    expect(mockSupportRequest).toHaveBeenCalledWith('ord-101', 'Need tracking help')
    expect(screen.getByText(/support request sent/i)).toBeInTheDocument()
  })
})
