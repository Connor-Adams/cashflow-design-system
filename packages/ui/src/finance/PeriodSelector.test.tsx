import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { PeriodSelector } from './PeriodSelector'

describe('PeriodSelector', () => {
  it('applies the ca-period-selector base class', () => {
    render(<PeriodSelector data-testid="ps" />)
    expect(screen.getByTestId('ps')).toHaveClass('ca-period-selector')
  })

  it('merges a consumer className with the base class', () => {
    render(<PeriodSelector className="inline" data-testid="ps" />)
    const el = screen.getByTestId('ps')
    expect(el).toHaveClass('ca-period-selector')
    expect(el).toHaveClass('inline')
  })

  it('reflects size as a data attribute', () => {
    render(<PeriodSelector size="sm" data-testid="ps" />)
    expect(screen.getByTestId('ps')).toHaveAttribute('data-size', 'sm')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<PeriodSelector ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders the current preset label on the trigger', () => {
    render(<PeriodSelector value="ytd" />)
    expect(screen.getByRole('button', { name: /Year to date/ })).toBeInTheDocument()
  })
})
