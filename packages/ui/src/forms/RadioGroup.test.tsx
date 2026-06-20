import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { RadioGroup } from './RadioGroup'

const opts = ['Daily', 'Weekly']

describe('RadioGroup', () => {
  it('renders a radiogroup with the ca-radio-group base class', () => {
    render(<RadioGroup options={opts} />)
    expect(screen.getByRole('radiogroup')).toHaveClass('ca-radio-group')
  })

  it('merges a consumer className with the base class', () => {
    render(<RadioGroup options={opts} className="mt-4" />)
    const el = screen.getByRole('radiogroup')
    expect(el).toHaveClass('ca-radio-group')
    expect(el).toHaveClass('mt-4')
  })

  it('reflects orientation as a data attribute', () => {
    render(<RadioGroup options={opts} orientation="horizontal" />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('renders one radio per option', () => {
    render(<RadioGroup options={opts} />)
    expect(screen.getAllByRole('radio')).toHaveLength(2)
  })

  it('marks the selected option via aria-checked', () => {
    render(<RadioGroup options={opts} value="Weekly" onValueChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Weekly' })).toHaveAttribute('aria-checked', 'true')
  })

  it('fires onValueChange when an option is picked', () => {
    const onValueChange = vi.fn()
    render(<RadioGroup options={opts} onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Weekly' }))
    expect(onValueChange).toHaveBeenCalledWith('Weekly')
  })

  it('does not fire when disabled', () => {
    const onValueChange = vi.fn()
    render(<RadioGroup options={opts} disabled onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Weekly' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('forwards a ref to the underlying radiogroup element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<RadioGroup options={opts} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('role', 'radiogroup')
  })
})
