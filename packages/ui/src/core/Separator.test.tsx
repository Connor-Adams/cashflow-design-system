import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Separator } from './Separator'

describe('Separator', () => {
  it('renders a horizontal rule by default', () => {
    const { container } = render(<Separator />)
    const el = container.querySelector('[data-slot="separator"]')!
    expect(el.tagName).toBe('HR')
    expect(el).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('applies the ca-separator base class', () => {
    const { container } = render(<Separator />)
    expect(container.querySelector('[data-slot="separator"]')).toHaveClass('ca-separator')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Separator className="my-2" />)
    const el = container.querySelector('[data-slot="separator"]')!
    expect(el).toHaveClass('ca-separator')
    expect(el).toHaveClass('my-2')
  })

  it('renders a vertical separator', () => {
    const { container } = render(<Separator orientation="vertical" />)
    const el = container.querySelector('[data-slot="separator"]')!
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveAttribute('data-orientation', 'vertical')
    expect(el).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders a labeled divider', () => {
    render(<Separator label="OR" />)
    expect(screen.getByText('OR')).toBeInTheDocument()
  })

  it('forwards a ref to the underlying hr', () => {
    const ref = createRef<HTMLElement>()
    render(<Separator ref={ref} />)
    expect(ref.current?.tagName).toBe('HR')
  })

  it('forwards a ref to the vertical span', () => {
    const ref = createRef<HTMLElement>()
    render(<Separator ref={ref} orientation="vertical" />)
    expect(ref.current?.tagName).toBe('SPAN')
  })
})
