import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { BudgetMeter } from './BudgetMeter'

describe('BudgetMeter', () => {
  it('applies the ca-budget-meter base class', () => {
    render(<BudgetMeter label="Groceries" spent={50} limit={100} data-testid="m" />)
    expect(screen.getByTestId('m')).toHaveClass('ca-budget-meter')
  })

  it('merges a consumer className with the base class', () => {
    render(<BudgetMeter label="Groceries" spent={50} limit={100} className="mb-2" data-testid="m" />)
    const el = screen.getByTestId('m')
    expect(el).toHaveClass('ca-budget-meter')
    expect(el).toHaveClass('mb-2')
  })

  it('reflects tone as a data attribute (under / near / over)', () => {
    const { rerender } = render(<BudgetMeter label="G" spent={10} limit={100} data-testid="m" />)
    expect(screen.getByTestId('m')).toHaveAttribute('data-tone', 'under')
    rerender(<BudgetMeter label="G" spent={90} limit={100} data-testid="m" />)
    expect(screen.getByTestId('m')).toHaveAttribute('data-tone', 'near')
    rerender(<BudgetMeter label="G" spent={120} limit={100} data-testid="m" />)
    expect(screen.getByTestId('m')).toHaveAttribute('data-tone', 'over')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<BudgetMeter label="G" spent={50} limit={100} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders the label', () => {
    render(<BudgetMeter label="Groceries" spent={50} limit={100} />)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
  })
})
