import { FormEvent, useState } from 'react'
import Button from '../components/ui/Button'
import AddressForm, { ShippingAddress } from '../components/checkout/AddressForm'
import OrderSummary, { CheckoutCartItem } from '../components/checkout/OrderSummary'
import { createOrder, generateIdempotencyKey } from '../lib/api/orders'

export interface CheckoutPageProps {
  cartId?: string
  cartItems?: CheckoutCartItem[]
}

const emptyAddress: ShippingAddress = {
  fullName: '',
  email: '',
  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
}

export default function CheckoutPage({
  cartId = 'guest-cart',
  cartItems = [],
}: CheckoutPageProps) {
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setError(null)
    setIsSubmitting(true)

    try {
      const idempotencyKey = generateIdempotencyKey('checkout')
      const response = await createOrder(cartId, idempotencyKey)
      setOrderId(response.id ?? response.orderId ?? 'order-placed')
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to place your order. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Checkout</h1>

      {error && (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {orderId && (
        <p className="mb-4 rounded-md border border-green-500/30 bg-green-500/5 p-3 text-sm text-green-700">
          Order placed
        </p>
      )}

      <form className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]" onSubmit={handleSubmit}>
        <section className="space-y-6 rounded-xl border border-border bg-background p-5">
          <AddressForm address={address} onChange={handleAddressChange} />

          <Button type="submit" disabled={isSubmitting || cartItems.length === 0} className="w-full">
            {isSubmitting ? 'Placing order...' : 'Place order'}
          </Button>
        </section>

        <OrderSummary cartItems={cartItems} />
      </form>
    </main>
  )
}
