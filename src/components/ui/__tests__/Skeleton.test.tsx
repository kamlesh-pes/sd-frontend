import { render, screen } from '@testing-library/react'
import Skeleton from '../Skeleton'

describe('Skeleton', () => {
  it('renders single skeleton by default', () => {
    const { container } = render(<Skeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons).toHaveLength(1)
  })

  it('renders multiple skeletons when count is provided', () => {
    const { container } = render(<Skeleton count={3} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons).toHaveLength(3)
  })

  it('applies default height and width', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('h-4')
    expect(skeleton?.className).toContain('w-full')
  })

  it('applies custom height and width', () => {
    const { container } = render(<Skeleton height="h-10" width="w-32" />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('h-10')
    expect(skeleton?.className).toContain('w-32')
  })

  it('renders circular skeleton when circle prop is true', () => {
    const { container } = render(<Skeleton circle />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('rounded-full')
  })

  it('applies rounded-md when circle is false', () => {
    const { container } = render(<Skeleton circle={false} />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('rounded-md')
  })

  it('applies muted background color', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('bg-muted')
  })

  it('adds margin to additional skeletons', () => {
    const { container } = render(<Skeleton count={2} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect((skeletons[0] as HTMLElement).className).not.toContain('mt-2')
    expect((skeletons[1] as HTMLElement).className).toContain('mt-2')
  })

  it('accepts custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('custom-class')
  })

  it('has pulse animation', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('animate-pulse')
  })
})
