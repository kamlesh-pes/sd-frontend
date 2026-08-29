import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../Modal'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Modal content
      </Modal>
    )
    expect(screen.queryByText('Modal content')).toBeNull()
  })

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal content
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeDefined()
  })

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        Content
      </Modal>
    )
    expect(screen.getByRole('heading', { level: 2, name: /modal title/i })).toBeDefined()
  })

  it('calls onClose when escape key is pressed', async () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    )
    await userEvent.keyboard('{Escape}')
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when clicking outside modal', async () => {
    const handleClose = vi.fn()
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        Modal content
      </Modal>
    )

    const backdrop = container.firstChild
    await userEvent.click(backdrop as HTMLElement)
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('does not close when clicking inside modal content', async () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <button>Click me</button>
      </Modal>
    )

    await userEvent.click(screen.getByText('Click me'))
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('renders footer when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} footer={<div>Footer content</div>}>
        Body
      </Modal>
    )
    expect(screen.getByText('Footer content')).toBeDefined()
  })

  it('has proper ARIA attributes', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    )
    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.getAttribute('aria-labelledby')).toBe('modal-title')
  })

  it('applies shadow and border styling', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}}>
        Content
      </Modal>
    )
    const modalContent = container.querySelector('[role="dialog"]')
    expect((modalContent as HTMLElement).className).toContain('rounded-lg')
    expect((modalContent as HTMLElement).className).toContain('border')
    expect((modalContent as HTMLElement).className).toContain('shadow-md')
  })

  it('accepts custom className', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} className="custom-class">
        Content
      </Modal>
    )
    const backdrop = container.firstChild
    expect((backdrop as HTMLElement).className).toContain('custom-class')
  })
})
