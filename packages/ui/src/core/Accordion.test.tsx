import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Accordion } from './Accordion'

const items = [
  { value: 'a', title: 'First', content: 'First body' },
  { value: 'b', title: 'Second', content: 'Second body' },
]

describe('Accordion', () => {
  it('renders a trigger per item', () => {
    render(<Accordion items={items} />)
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument()
  })

  it('applies the ca-accordion base class', () => {
    const { container } = render(<Accordion items={items} />)
    expect(container.querySelector('[data-slot="accordion"]')).toHaveClass('ca-accordion')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Accordion items={items} className="mt-4" />)
    const el = container.querySelector('[data-slot="accordion"]')!
    expect(el).toHaveClass('ca-accordion')
    expect(el).toHaveClass('mt-4')
  })

  it('opens via defaultValue and reflects data-state', () => {
    render(<Accordion items={items} defaultValue="a" />)
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('data-state', 'open')
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('data-state', 'closed')
  })

  it('toggles open on click (single)', () => {
    render(<Accordion items={items} />)
    const first = screen.getByRole('button', { name: 'First' })
    expect(first).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
  })

  it('single mode keeps only one open', () => {
    render(<Accordion items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'First' }))
    fireEvent.click(screen.getByRole('button', { name: 'Second' }))
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('multiple mode allows several open', () => {
    render(<Accordion items={items} type="multiple" />)
    fireEvent.click(screen.getByRole('button', { name: 'First' }))
    fireEvent.click(screen.getByRole('button', { name: 'Second' }))
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('forwards a ref to the root div', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Accordion ref={ref} items={items} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'accordion')
  })
})
