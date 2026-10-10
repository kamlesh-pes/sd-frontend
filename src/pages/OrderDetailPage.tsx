import { FormEvent, useState } from 'react'
import Button from '../components/ui/Button'
import OrderTimeline from '../components/order/OrderTimeline'
import { cancelOrder, createSupportRequest } from '../lib/api/orders'

export interface OrderDetailShippingAddress {
  fullName: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderDetailItem {
  id: string
  name: string
  quantity: number
  unitPrice: string
  thumbnailUrl?: string
}

export interface OrderDetailRecord {
  id: string
  createdAt: string
  status: string
  total: string
  itemCount: number
  shippingAddress?: OrderDetailShippingAddress
  items: OrderDetailItem[]
  timeline?: string[]
  cancelEligible?: boolean
}

export interface OrderDetailPageProps {
  order?: OrderDetailRecord
}

export default function OrderDetailPage({ order }: OrderDetailPageProps) {
  const [cancelReason, setCancelReason] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [localStatus, setLocalStatus] = useState(order?.status ?? '')
  const [actionMessage, setActionMessage] = useState('')

  if (!order) {
    return <p className="p-8 text-muted-foreground">No order selected.</p>
  }

  const activeStatus = localStatus || order.status
  const isCancellable = Boolean(order.cancelEligible)

  const handleCancel = async (event: FormEvent) => {
    event.preventDefault()
    if (!cancelReason.trim()) {
      return
    }

    await cancelOrder(order.id, cancelReason.trim())
    setLocalStatus('Cancelled')
    setActionMessage('Order cancelled')
  }

  const handleSupport = async (event: FormEvent) => {
    event.preventDefault()
    if (!supportMessage.trim()) {
      return
    }

    await createSupportRequest(order.id, supportMessage.trim())
    setActionMessage('Support request sent')
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">Order</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Order {order.id}</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-xl font-semibold text-foreground">Items</h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-foreground">${(Number.parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-6 rounded-xl border border-border bg-surface p-5">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{activeStatus}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="mt-1 text-xl font-bold text-foreground">${Number.parseFloat(order.total).toFixed(2)}</p>
          </div>

          {order.shippingAddress && (
            <div>
              <p className="text-sm text-muted-foreground">Shipping address</p>
              <div className="mt-2 text-foreground">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {actionMessage && (
        <p className="mt-4 rounded-md border border-green-500/30 bg-green-500/5 p-3 text-sm text-green-700">
          {actionMessage}
        </p>
      )}

      {isCancellable && activeStatus !== 'Cancelled' && (
        <section className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-xl font-semibold text-foreground">Cancel order</h2>
          <form className="mt-4 space-y-3" onSubmit={handleCancel}>
            <label className="block text-sm font-medium text-foreground" htmlFor="cancel-reason">
              Cancel reason
              <textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                rows={3}
              />
            </label>
            <Button type="submit" variant="destructive" disabled={!cancelReason.trim()}>
              Cancel order
            </Button>
          </form>
        </section>
      )}

      {!isCancellable && activeStatus !== 'Cancelled' && (
        <section className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-xl font-semibold text-foreground">Need help?</h2>
          <form className="mt-4 space-y-3" onSubmit={handleSupport}>
            <label className="block text-sm font-medium text-foreground" htmlFor="support-message">
              Support message
              <textarea
                id="support-message"
                value={supportMessage}
                onChange={(event) => setSupportMessage(event.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                rows={3}
              />
            </label>
            <Button type="submit" variant="secondary" disabled={!supportMessage.trim()}>
              Contact support
            </Button>
          </form>
        </section>
      )}

      <section className="mt-8 rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xl font-semibold text-foreground">Status timeline</h2>
        <OrderTimeline status={activeStatus} timeline={order.timeline} />
      </section>
    </main>
  )
}
