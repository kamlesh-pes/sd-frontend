export interface CheckoutCartItem {
  productId: string
  name: string
  quantity: number
  unitPrice: string
}

export interface OrderSummaryProps {
  cartItems: CheckoutCartItem[]
  shippingCost?: number
}

export function OrderSummary({ cartItems, shippingCost = 9.99 }: OrderSummaryProps) {
  const subtotal = cartItems.reduce((total, item) => {
    const unitPrice = Number.parseFloat(item.unitPrice)
    return total + (Number.isFinite(unitPrice) ? unitPrice * item.quantity : 0)
  }, 0)

  const total = subtotal + shippingCost

  return (
    <aside className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-xl font-semibold text-foreground">Order summary</h2>

      <div className="mt-4 space-y-3">
        {cartItems.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}

        {cartItems.map((item) => (
          <div key={item.productId} className="flex items-center justify-between gap-4 text-sm">
            <div>
              <p className="font-medium text-foreground">{item.name}</p>
              <p className="text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium text-foreground">${(Number.parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-foreground">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  )
}

export default OrderSummary
