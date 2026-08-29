import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined()
  })

  it('renders with primary variant by default', () => {
    const { container } = render(<Button>Button</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('bg-primary')
  })

  it('renders with different variants', () => {
    const { rerender, container } = render(<Button variant="secondary">Button</Button>)
    expect(container.querySelector('button')?.className).toContain('bg-muted')

    rerender(<Button variant="destructive">Button</Button>)
    expect(container.querySelector('button')?.className).toContain('bg-destructive')

    rerender(<Button variant="ghost">Button</Button>)
    expect(container.querySelector('button')?.className).toContain('bg-transparent')
  })

  it('renders with different sizes', () => {
    const { rerender, container } = render(<Button size="sm">Button</Button>)
    expect(container.querySelector('button')?.className).toContain('text-sm')

    rerender(<Button size="lg">Button</Button>)
    expect(container.querySelector('button')?.className).toContain('text-lg')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(screen.getByRole('button', { name: /click/i }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>)
    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeDisabled()
  })

  it('has proper focus styles for accessibility', () => {
    const { container } = render(<Button>Accessible</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('focus-visible:ring-2')
  })

  it('accepts custom className', () => {
    const { container } = render(<Button className="custom-class">Button</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('custom-class')
  })
})
