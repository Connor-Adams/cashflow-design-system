import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { AmountText } from './AmountText'

describe('AmountText', () => {
  it('applies the ca-amount base class', () => {
    render(<AmountText value={42} data-testid="amt" />)
    expect(screen.getByTestId('amt')).toHaveClass('ca-amount')
  })

  it('merges a consumer className with the base class', () => {
    render(<AmountText value={42} className="ml-2" data-testid="amt" />)
    const el = screen.getByTestId('amt')
    expect(el).toHaveClass('ca-amount')
    expect(el).toHaveClass('ml-2')
  })

  it('reflects direction as a data attribute', () => {
    render(<AmountText value={-5} data-testid="amt" />)
    expect(screen.getByTestId('amt')).toHaveAttribute('data-direction', 'out')
  })

  it('reflects an explicit direction prop', () => {
    render(<AmountText value={5} direction="zero" data-testid="amt" />)
    expect(screen.getByTestId('amt')).toHaveAttribute('data-direction', 'zero')
  })

  it('forwards a ref to the underlying span element', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<AmountText value={42} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('renders the formatted positive value with a sign unchanged', () => {
    render(<AmountText value={1234.5} data-testid="amt" />)
    expect(screen.getByTestId('amt')).toHaveTextContent('+$1,234.50')
  })

  it('renders the formatted negative value with a minus sign unchanged', () => {
    render(<AmountText value={-1234.5} data-testid="amt" />)
    expect(screen.getByTestId('amt')).toHaveTextContent('−$1,234.50')
  })

  it('omits the sign when showSign is false', () => {
    render(<AmountText value={1234.5} showSign={false} data-testid="amt" />)
    const el = screen.getByTestId('amt')
    expect(el).toHaveTextContent('$1,234.50')
    expect(el.textContent).not.toContain('+')
  })
})
