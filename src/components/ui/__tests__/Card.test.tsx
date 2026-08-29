import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card, { CardHeader, CardBody, CardFooter, CardTitle, CardDescription } from '../Card'

describe('Card', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeDefined()
  })

  it('applies card styling', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild
    expect((card as HTMLElement).className).toContain('rounded-lg')
    expect((card as HTMLElement).className).toContain('border')
    expect((card as HTMLElement).className).toContain('bg-surface')
  })

  it('accepts custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    const card = container.firstChild
    expect((card as HTMLElement).className).toContain('custom-class')
  })
})

describe('CardHeader', () => {
  it('renders header with border', () => {
    const { container } = render(<CardHeader>Header</CardHeader>)
    const header = container.firstChild
    expect((header as HTMLElement).className).toContain('border-b')
  })

  it('renders header content', () => {
    render(<CardHeader>Header Content</CardHeader>)
    expect(screen.getByText('Header Content')).toBeDefined()
  })
})

describe('CardBody', () => {
  it('renders body content', () => {
    render(<CardBody>Body Content</CardBody>)
    expect(screen.getByText('Body Content')).toBeDefined()
  })

  it('applies body padding', () => {
    const { container } = render(<CardBody>Content</CardBody>)
    const body = container.firstChild
    expect((body as HTMLElement).className).toContain('px-4')
    expect((body as HTMLElement).className).toContain('py-4')
  })
})

describe('CardFooter', () => {
  it('renders footer with border', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>)
    const footer = container.firstChild
    expect((footer as HTMLElement).className).toContain('border-t')
  })

  it('renders footer content', () => {
    render(<CardFooter>Footer Content</CardFooter>)
    expect(screen.getByText('Footer Content')).toBeDefined()
  })
})

describe('CardTitle', () => {
  it('renders as heading element', () => {
    render(<CardTitle>Title</CardTitle>)
    const heading = screen.getByRole('heading', { level: 3, name: /title/i })
    expect(heading).toBeDefined()
  })

  it('applies title styling', () => {
    const { container } = render(<CardTitle>Title</CardTitle>)
    const title = container.firstChild
    expect((title as HTMLElement).className).toContain('text-lg')
    expect((title as HTMLElement).className).toContain('font-semibold')
  })
})

describe('CardDescription', () => {
  it('renders description paragraph', () => {
    render(<CardDescription>Description text</CardDescription>)
    expect(screen.getByText('Description text')).toBeDefined()
  })

  it('applies muted foreground color', () => {
    const { container } = render(<CardDescription>Description</CardDescription>)
    const description = container.firstChild
    expect((description as HTMLElement).className).toContain('text-muted-foreground')
  })
})

describe('Card composition', () => {
  it('composes header, body, and footer', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardBody>Body content</CardBody>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )

    expect(screen.getByRole('heading', { level: 3, name: /card title/i })).toBeDefined()
    expect(screen.getByText('Card description')).toBeDefined()
    expect(screen.getByText('Body content')).toBeDefined()
    expect(screen.getByText('Footer content')).toBeDefined()
  })
})
