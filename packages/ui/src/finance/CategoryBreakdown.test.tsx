import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryBreakdown } from './CategoryBreakdown'

const ROWS = [
  { category: 'groceries', amount: -842 },
  { category: 'dining', amount: -586 },
  { category: 'transport', amount: -418 },
]

describe('CategoryBreakdown', () => {
  it('applies the ca-category-breakdown base class', () => {
    render(<CategoryBreakdown rows={ROWS} data-testid="cb" />)
    expect(screen.getByTestId('cb')).toHaveClass('ca-category-breakdown')
  })

  it('merges a consumer className with the base class', () => {
    render(<CategoryBreakdown rows={ROWS} className="w-full" data-testid="cb" />)
    const el = screen.getByTestId('cb')
    expect(el).toHaveClass('ca-category-breakdown')
    expect(el).toHaveClass('w-full')
  })

  it('sets data-slot="category-breakdown"', () => {
    render(<CategoryBreakdown rows={ROWS} data-testid="cb" />)
    expect(screen.getByTestId('cb')).toHaveAttribute('data-slot', 'category-breakdown')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<CategoryBreakdown rows={ROWS} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it('renders title and subtitle', () => {
    render(<CategoryBreakdown rows={ROWS} title="Net spend by category" subtitle="This month" />)
    expect(screen.getByText('Net spend by category')).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  it('renders one pill and one amount per row', () => {
    const { container } = render(<CategoryBreakdown rows={ROWS} />)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Dining')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()
    // AmountText slots (mono, signed, oxblood) — one per row. Match on digits,
    // not the exact currency symbol (ICU varies $ vs CA$ by Node build).
    const amounts = container.querySelectorAll('[data-slot="amount"]')
    expect(amounts).toHaveLength(3)
    expect(amounts[0]!.textContent).toMatch(/842/)
  })

  it('renders the header but no rows when rows is empty', () => {
    render(<CategoryBreakdown rows={[]} title="Empty" data-testid="cb" />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
  })
})

describe('CategoryBreakdown bar scaling', () => {
  it('renders the largest row at 100% and scales the rest', () => {
    render(
      <CategoryBreakdown
        rows={[
          { category: 'groceries', amount: -800 },
          { category: 'dining', amount: -400 },
        ]}
      />,
    )
    const bars = screen.getAllByRole('progressbar', { hidden: true })
    expect(bars[0]).toHaveAttribute('aria-valuenow', '100')
    expect(bars[1]).toHaveAttribute('aria-valuenow', '50')
  })

  it('honors an explicit max as the bar denominator', () => {
    render(<CategoryBreakdown rows={[{ category: 'groceries', amount: -500 }]} max={1000} />)
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('aria-valuenow', '50')
  })

  it('renders bars at 0% when all amounts are zero (no divide-by-zero)', () => {
    render(<CategoryBreakdown rows={[{ category: 'groceries', amount: 0 }]} />)
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('aria-valuenow', '0')
  })
})

describe('CategoryBreakdown trend sparkline', () => {
  it('renders a sparkline when trend is provided', () => {
    const { container } = render(
      <CategoryBreakdown rows={[{ category: 'groceries', amount: -800 }]} trend={[1, 2, 3, 4]} />,
    )
    expect(container.querySelector('[data-slot="sparkline"]')).toBeInTheDocument()
  })

  it('renders no sparkline when trend is omitted', () => {
    const { container } = render(
      <CategoryBreakdown rows={[{ category: 'groceries', amount: -800 }]} />,
    )
    expect(container.querySelector('[data-slot="sparkline"]')).not.toBeInTheDocument()
  })
})

describe('CategoryBreakdown selectable rows', () => {
  it('renders rows as non-button divs when onSelect is absent', () => {
    render(<CategoryBreakdown rows={[{ category: 'groceries', amount: -800 }]} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders each row as a button and fires onSelect with the category', () => {
    const onSelect = vi.fn()
    render(
      <CategoryBreakdown
        rows={[
          { category: 'groceries', amount: -800 },
          { category: 'dining', amount: -400 },
        ]}
        onSelect={onSelect}
      />,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    fireEvent.click(buttons[0]!)
    expect(onSelect).toHaveBeenCalledWith('groceries', { category: 'groceries', amount: -800 })
  })

  it('gives each selectable row an accessible label', () => {
    render(
      <CategoryBreakdown rows={[{ category: 'groceries', amount: -842 }]} onSelect={() => {}} />,
    )
    expect(screen.getByRole('button', { name: /groceries/i })).toBeInTheDocument()
  })
})
