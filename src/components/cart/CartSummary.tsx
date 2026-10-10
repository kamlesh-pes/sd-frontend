import { guestCartStore } from '../../state/guestCart'

type CartSummaryProps = {
  className?: string
}

export function CartSummary({ className = '' }: CartSummaryProps) {
  const items = guestCartStore((state) => state.items)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const subtotal = items.reduce((total, item) => {
    const unitPrice = Number.parseFloat(item.unitPrice)
    return total + (Number.isFinite(unitPrice) ? unitPrice * item.quantity : 0)
  }, 0)

  return (
    <div className={className}>
      <p>Items: {itemCount}</p>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
    </div>
  )
}
