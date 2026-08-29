import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '../Input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined()
  })

  it('renders with label', () => {
    render(<Input id="test-input" label="Test Label" />)
    expect(screen.getByLabelText('Test Label')).toBeDefined()
  })

  it('handles value changes', async () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement
    await userEvent.type(input, 'test value')
    expect(input.value).toBe('test value')
  })

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeDefined()
  })

  it('applies error styling when error is present', () => {
    const { container } = render(<Input error="Error" />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('border-destructive')
  })

  it('disables input when disabled prop is true', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('has proper focus styles for accessibility', () => {
    const { container } = render(<Input />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('focus-visible:ring-2')
  })

  it('supports different input types', async () => {
    render(<Input type="email" data-testid="email-input" />)
    const input = screen.getByTestId('email-input') as HTMLInputElement
    expect(input.type).toBe('email')
  })

  it('accepts custom className', () => {
    const { container } = render(<Input className="custom-class" />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('custom-class')
  })

  it('associates label with input via id', () => {
    render(<Input id="associated-input" label="Associated Label" />)
    const label = screen.getByText('Associated Label')
    expect(label.getAttribute('for')).toBe('associated-input')
  })
})
