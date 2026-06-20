import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('applies the ca-alert base class', () => {
    render(<Alert>Heads up</Alert>)
    expect(screen.getByRole('status')).toHaveClass('ca-alert')
  })

  it('merges a consumer className with the base class', () => {
    render(<Alert className="mt-4">Heads up</Alert>)
    const el = screen.getByRole('status')
    expect(el).toHaveClass('ca-alert')
    expect(el).toHaveClass('mt-4')
  })

  it('renders children in the body', () => {
    render(<Alert>Something happened</Alert>)
    expect(screen.getByText('Something happened')).toBeInTheDocument()
  })

  it('reflects variant as a data attribute', () => {
    render(<Alert variant="warning">Careful</Alert>)
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'warning')
  })

  it('defaults variant to "info"', () => {
    render(<Alert>Note</Alert>)
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'info')
  })

  it('uses role=alert and assertive live region for error', () => {
    render(<Alert variant="error">Boom</Alert>)
    const el = screen.getByRole('alert')
    expect(el).toHaveAttribute('data-variant', 'error')
    expect(el).toHaveAttribute('aria-live', 'assertive')
  })

  it('uses role=status and polite live region for non-error', () => {
    render(<Alert variant="success">Done</Alert>)
    const el = screen.getByRole('status')
    expect(el).toHaveAttribute('aria-live', 'polite')
  })

  it('renders a title and an action', () => {
    render(
      <Alert title="Title" action={<button>Undo</button>}>
        Body
      </Alert>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
  })

  it('forwards a ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Alert ref={ref}>Heads up</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'alert')
  })
})
