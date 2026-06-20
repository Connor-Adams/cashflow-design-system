import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToggleGroup } from './ToggleGroup'

const items = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
]

describe('ToggleGroup', () => {
  it('renders a group with the ca-toggle-group base class', () => {
    render(<ToggleGroup items={items} />)
    expect(screen.getByRole('group')).toHaveClass('ca-toggle-group')
  })

  it('merges a consumer className with the base class', () => {
    render(<ToggleGroup items={items} className="mt-4" />)
    const el = screen.getByRole('group')
    expect(el).toHaveClass('ca-toggle-group')
    expect(el).toHaveClass('mt-4')
  })

  it('reflects size as a data attribute', () => {
    render(<ToggleGroup items={items} size="sm" />)
    expect(screen.getByRole('group')).toHaveAttribute('data-size', 'sm')
  })

  it('renders one button per item', () => {
    render(<ToggleGroup items={items} />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('marks the active item via aria-pressed (single)', () => {
    render(<ToggleGroup items={items} value="b" onValueChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('fires onValueChange with a string for single type', () => {
    const onValueChange = vi.fn()
    render(<ToggleGroup items={items} type="single" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'A' }))
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('fires onValueChange with an array for multiple type', () => {
    const onValueChange = vi.fn()
    render(<ToggleGroup items={items} type="multiple" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'A' }))
    expect(onValueChange).toHaveBeenCalledWith(['a'])
  })

  it('forwards a ref to the underlying group element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<ToggleGroup items={items} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('role', 'group')
  })
})
