import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Body</Card>)
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('applies the ca-card base class', () => {
    const { container } = render(<Card>Body</Card>)
    expect(container.querySelector('[data-slot="card"]')).toHaveClass('ca-card')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Card className="mt-4">Body</Card>)
    const el = container.querySelector('[data-slot="card"]')!
    expect(el).toHaveClass('ca-card')
    expect(el).toHaveClass('mt-4')
  })

  it('forwards a ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Card ref={ref}>Body</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'card')
  })

  it('sets the data-slot', () => {
    const { container } = render(<Card>Body</Card>)
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument()
  })
})

describe('Card sub-parts', () => {
  it('CardHeader applies base class and forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<CardHeader ref={ref}>H</CardHeader>)
    const el = container.querySelector('[data-slot="card-header"]')!
    expect(el).toHaveClass('ca-card-header')
    expect(ref.current).toBe(el)
  })

  it('CardTitle applies base class and forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<CardTitle ref={ref}>T</CardTitle>)
    const el = container.querySelector('[data-slot="card-title"]')!
    expect(el).toHaveClass('ca-card-title')
    expect(ref.current).toBe(el)
  })

  it('CardDescription applies base class and forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<CardDescription ref={ref}>D</CardDescription>)
    const el = container.querySelector('[data-slot="card-description"]')!
    expect(el).toHaveClass('ca-card-description')
    expect(ref.current).toBe(el)
  })

  it('CardContent applies base class and forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<CardContent ref={ref}>C</CardContent>)
    const el = container.querySelector('[data-slot="card-content"]')!
    expect(el).toHaveClass('ca-card-content')
    expect(ref.current).toBe(el)
  })

  it('merges consumer className on sub-parts', () => {
    const { container } = render(<CardContent className="p-0">C</CardContent>)
    const el = container.querySelector('[data-slot="card-content"]')!
    expect(el).toHaveClass('ca-card-content')
    expect(el).toHaveClass('p-0')
  })
})
