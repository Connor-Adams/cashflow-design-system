import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Combobox } from './Combobox'

const options = ['Apple', 'Banana', 'Cherry']

describe('Combobox', () => {
  it('renders with the ca-combobox base class', () => {
    const { container } = render(<Combobox options={options} />)
    expect(container.querySelector('[data-slot="combobox"]')).toHaveClass('ca-combobox')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Combobox options={options} className="mt-4" />)
    const el = container.querySelector('[data-slot="combobox"]')
    expect(el).toHaveClass('ca-combobox')
    expect(el).toHaveClass('mt-4')
  })

  it('carries the combobox data-slot', () => {
    const { container } = render(<Combobox options={options} />)
    expect(container.querySelector('[data-slot="combobox"]')).toBeInTheDocument()
  })

  it('opens the listbox and filters on typing', () => {
    render(<Combobox options={options} />)
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'ban' } })
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
  })

  it('fires onValueChange when an option is chosen', () => {
    const onValueChange = vi.fn()
    render(<Combobox options={options} onValueChange={onValueChange} />)
    fireEvent.focus(screen.getByRole('textbox'))
    fireEvent.click(screen.getByRole('option', { name: 'Cherry' }))
    expect(onValueChange).toHaveBeenCalledWith('Cherry')
  })

  it('marks the selected option active via data-active / aria-selected', () => {
    render(<Combobox options={options} value="Banana" onValueChange={() => {}} />)
    fireEvent.focus(screen.getByRole('textbox'))
    const opt = screen.getByRole('option', { name: 'Banana' })
    expect(opt).toHaveAttribute('aria-selected', 'true')
    expect(opt).toHaveAttribute('data-active', 'true')
  })

  it('shows emptyText when nothing matches', () => {
    render(<Combobox options={options} emptyText="Nope" />)
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'zzz' } })
    expect(screen.getByText('Nope')).toBeInTheDocument()
  })

  it('forwards a ref to the underlying search input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Combobox options={options} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
