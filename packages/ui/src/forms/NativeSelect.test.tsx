import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { NativeSelect } from './NativeSelect'

describe('NativeSelect', () => {
  it('renders a combobox with the ca-native-select base class', () => {
    render(<NativeSelect aria-label="Pick" options={['a', 'b']} />)
    expect(screen.getByRole('combobox', { name: 'Pick' })).toHaveClass('ca-native-select')
  })

  it('merges a consumer className with the base class', () => {
    render(<NativeSelect aria-label="Pick" className="mt-4" options={['a']} />)
    const el = screen.getByRole('combobox', { name: 'Pick' })
    expect(el).toHaveClass('ca-native-select')
    expect(el).toHaveClass('mt-4')
  })

  it('reflects size as a data attribute', () => {
    render(<NativeSelect aria-label="Pick" size="sm" options={['a']} />)
    expect(screen.getByRole('combobox', { name: 'Pick' })).toHaveAttribute('data-size', 'sm')
  })

  it('defaults size to "default"', () => {
    render(<NativeSelect aria-label="Pick" options={['a']} />)
    expect(screen.getByRole('combobox', { name: 'Pick' })).toHaveAttribute('data-size', 'default')
  })

  it('carries the native-select data-slot', () => {
    render(<NativeSelect aria-label="Pick" options={['a']} />)
    expect(screen.getByRole('combobox', { name: 'Pick' })).toHaveAttribute('data-slot', 'native-select')
  })

  it('renders options from strings and from {value,label}', () => {
    render(<NativeSelect aria-label="Pick" options={['apple', { value: 'b', label: 'Banana' }]} />)
    expect(screen.getByRole('option', { name: 'apple' })).toHaveValue('apple')
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveValue('b')
  })

  it('renders <option> children when no options prop is given', () => {
    render(
      <NativeSelect aria-label="Pick">
        <option value="x">X</option>
      </NativeSelect>,
    )
    expect(screen.getByRole('option', { name: 'X' })).toHaveValue('x')
  })

  it('forwards a ref to the underlying select element', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<NativeSelect aria-label="Pick" ref={ref} options={['a']} />)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })

  it('spreads value/onChange wiring onto the native control', () => {
    render(<NativeSelect aria-label="Pick" value="b" onChange={() => {}} options={['a', 'b']} />)
    expect(screen.getByRole('combobox', { name: 'Pick' })).toHaveValue('b')
  })
})
