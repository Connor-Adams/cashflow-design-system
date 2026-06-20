import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { AccountCard } from './AccountCard'

describe('AccountCard', () => {
  it('applies the ca-account-card base class', () => {
    render(<AccountCard name="Chequing" data-testid="card" />)
    expect(screen.getByTestId('card')).toHaveClass('ca-account-card')
  })

  it('merges a consumer className with the base class', () => {
    render(<AccountCard name="Chequing" className="w-full" data-testid="card" />)
    const el = screen.getByTestId('card')
    expect(el).toHaveClass('ca-account-card')
    expect(el).toHaveClass('w-full')
  })

  it('reflects kind as a data attribute', () => {
    render(<AccountCard name="Visa" kind="credit" data-testid="card" />)
    expect(screen.getByTestId('card')).toHaveAttribute('data-kind', 'credit')
  })

  it('reflects selected as a data attribute', () => {
    render(<AccountCard name="Chequing" selected data-testid="card" />)
    expect(screen.getByTestId('card')).toHaveAttribute('data-selected', 'true')
  })

  it('renders a div by default and a button when interactive', () => {
    const { rerender } = render(<AccountCard name="Chequing" data-testid="card" />)
    expect(screen.getByTestId('card').tagName).toBe('DIV')
    rerender(<AccountCard name="Chequing" onClick={() => {}} data-testid="card" />)
    expect(screen.getByTestId('card').tagName).toBe('BUTTON')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<AccountCard name="Chequing" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it('renders the name', () => {
    render(<AccountCard name="Chequing" />)
    expect(screen.getByText('Chequing')).toBeInTheDocument()
  })
})
