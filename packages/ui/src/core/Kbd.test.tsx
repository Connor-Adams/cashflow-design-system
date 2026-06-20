import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Kbd } from './Kbd'

describe('Kbd', () => {
  it('renders its children', () => {
    render(<Kbd>Esc</Kbd>)
    expect(screen.getByText('Esc')).toBeInTheDocument()
  })

  it('applies the ca-kbd base class', () => {
    const { container } = render(<Kbd>Esc</Kbd>)
    expect(container.querySelector('[data-slot="kbd"]')).toHaveClass('ca-kbd')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Kbd className="ml-1">Esc</Kbd>)
    const el = container.querySelector('[data-slot="kbd"]')!
    expect(el).toHaveClass('ca-kbd')
    expect(el).toHaveClass('ml-1')
  })

  it('keeps static styling in CSS, not the inline style attribute', () => {
    const { container } = render(<Kbd>Esc</Kbd>)
    const el = container.querySelector('[data-slot="kbd"]')!
    expect(el.getAttribute('style')).toBeNull()
  })

  it('forwards a ref to the underlying kbd element', () => {
    const ref = createRef<HTMLElement>()
    render(<Kbd ref={ref}>Esc</Kbd>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('KBD')
  })
})
