import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { MoneyInput } from './MoneyInput'

describe('MoneyInput', () => {
  it('applies the ca-money-input base class on the input', () => {
    render(<MoneyInput data-testid="mi" />)
    expect(screen.getByTestId('mi')).toHaveClass('ca-money-input')
  })

  it('merges a consumer className with the base class', () => {
    render(<MoneyInput className="custom" data-testid="mi" />)
    const el = screen.getByTestId('mi')
    expect(el).toHaveClass('ca-money-input')
    expect(el).toHaveClass('custom')
  })

  it('reflects size as a data attribute', () => {
    render(<MoneyInput size="sm" data-testid="mi" />)
    expect(screen.getByTestId('mi')).toHaveAttribute('data-size', 'sm')
  })

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<MoneyInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('groups a controlled numeric value when not focused', () => {
    render(<MoneyInput value={1234.5} data-testid="mi" />)
    expect((screen.getByTestId('mi') as HTMLInputElement).value).toBe('1,234.50')
  })

  it('renders the placeholder', () => {
    render(<MoneyInput placeholder="0.00" data-testid="mi" />)
    expect(screen.getByTestId('mi')).toHaveAttribute('placeholder', '0.00')
  })
})
