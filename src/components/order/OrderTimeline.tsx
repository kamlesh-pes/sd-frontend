export interface OrderTimelineProps {
  status: string
  timeline?: string[]
}

export function getDefaultTimeline(status: string): string[] {
  if (status === 'Cancelled') {
    return ['Ordered', 'Cancelled']
  }

  return ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
}

export default function OrderTimeline({ status, timeline = getDefaultTimeline(status) }: OrderTimelineProps) {
  const statuses = timeline.length ? timeline : getDefaultTimeline(status)
  const currentIndex = Math.max(0, statuses.indexOf(status))

  return (
    <ol className="mt-4 space-y-3">
      {statuses.map((item, index) => {
        const isCurrent = index === currentIndex
        const isDone = index < currentIndex

        return (
          <li key={`${item}-${index}`} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : isDone
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </span>
            <span className={isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}>{item}</span>
          </li>
        )
      })}
    </ol>
  )
}
