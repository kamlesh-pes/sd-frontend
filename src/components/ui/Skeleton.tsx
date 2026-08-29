import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  height?: string
  width?: string
  circle?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ count = 1, height = 'h-4', width = 'w-full', circle = false, className, ...props }, ref) => {
    const items = Array.from({ length: count })

    return (
      <>
        {items.map((_, index) => (
          <div
            key={index}
            ref={index === 0 ? ref : null}
            className={`animate-pulse rounded-md bg-muted ${circle ? 'rounded-full' : ''} ${height} ${width} ${className || ''} ${index > 0 ? 'mt-2' : ''}`}
            {...props}
          />
        ))}
      </>
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
