import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from './Tabs'

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

describe('Tabs', () => {
  it('renders a tablist with one tab per item', () => {
    render(<Tabs items={items} value="a" />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(2)
  })

  it('applies the ca-tabs base class to the tablist', () => {
    render(<Tabs items={items} value="a" />)
    expect(screen.getByRole('tablist')).toHaveClass('ca-tabs')
  })

  it('merges a consumer className with the base class', () => {
    render(<Tabs items={items} value="a" className="mt-2" />)
    const list = screen.getByRole('tablist')
    expect(list).toHaveClass('ca-tabs')
    expect(list).toHaveClass('mt-2')
  })

  it('forwards a ref to the underlying tablist element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Tabs ref={ref} items={items} value="a" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('role', 'tablist')
  })

  it('marks the active tab via aria-selected and data-state', () => {
    render(<Tabs items={items} value="b" />)
    const [alpha, beta] = screen.getAllByRole('tab')
    expect(alpha).toHaveAttribute('aria-selected', 'false')
    expect(beta).toHaveAttribute('aria-selected', 'true')
    expect(beta).toHaveAttribute('data-state', 'active')
  })

  it('fires onValueChange when a tab is clicked', () => {
    const onValueChange = vi.fn()
    render(<Tabs items={items} value="a" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('applies the ca-tabs-trigger class to each tab', () => {
    render(<Tabs items={items} value="a" />)
    screen.getAllByRole('tab').forEach((tab) => expect(tab).toHaveClass('ca-tabs-trigger'))
  })
})
