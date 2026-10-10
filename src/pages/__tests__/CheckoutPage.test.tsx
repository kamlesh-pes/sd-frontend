import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CheckoutPage from '../CheckoutPage'

const mockCreateOrder = vi.fn()

vi.mock('../../lib/api/orders', () => ({
  createOrder: (...args: unknown[]) => mockCreateOrder(...args),
  generateIdempotencyKey: () => 'checkout-test-key',
}))

describe('CheckoutPage', () => {
  beforeEach(() => {
    mockCreateOrder.mockReset()
    window.sessionStorage.clear()
  })

  it('renders shipping fields and creates an order with an idempotency key', async () => {
    mockCreateOrder.mockResolvedValue({ id: 'order-123' })
    const user = userEvent.setup()

    render(<CheckoutPage cartItems={[{ productId: 'p-1', name: 'Keyboard', quantity: 2, unitPrice: '79.00' }]} />)

    await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com')
    await user.type(screen.getByLabelText(/address line 1/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'Boston')
    await user.type(screen.getByLabelText(/state/i), 'MA')
    await user.type(screen.getByLabelText(/postal code/i), '02116')
    await user.type(screen.getByLabelText(/country/i), 'USA')

    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(mockCreateOrder).toHaveBeenCalledWith('guest-cart', 'checkout-test-key')
    expect(screen.getByText(/order placed/i)).toBeInTheDocument()
  })
})
