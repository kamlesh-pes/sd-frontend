export interface OrderItemSummary {
  id: string
  name: string
  quantity: number
  unitPrice: string
  thumbnailUrl?: string
}

export interface OrderSummaryRecord {
  id: string
  createdAt: string
  status: string
  total: string
  itemCount: number
  items: OrderItemSummary[]
}

export interface OrdersPageProps {
  orders?: OrderSummaryRecord[]
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function OrdersPage({ orders = [] }: OrdersPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Order history</h1>

      {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                <h2 className="text-lg font-semibold text-foreground">{order.id}</h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">
                  {order.status}
                </span>
                <strong className="text-lg font-semibold text-foreground">${Number.parseFloat(order.total).toFixed(2)}</strong>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{order.itemCount} items</span>
              <span>View details</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
