import { createRef } from 'react'
import { render } from '@testing-library/react'
import { Skeleton, SkeletonText } from './Skeleton'

describe('Skeleton', () => {
  it('applies the ca-skeleton base class', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('[data-slot="skeleton"]')).toHaveClass('ca-skeleton')
  })

  it('keeps the shimmer class for the animation', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('[data-slot="skeleton"]')).toHaveClass('skeleton-shimmer')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Skeleton className="mt-4" />)
    const el = container.querySelector('[data-slot="skeleton"]')
    expect(el).toHaveClass('ca-skeleton')
    expect(el).toHaveClass('mt-4')
  })

  it('applies w/h props as inline size', () => {
    const { container } = render(<Skeleton w={120} h={24} />)
    const el = container.querySelector('[data-slot="skeleton"]') as HTMLElement
    expect(el.style.width).toBe('120px')
    expect(el.style.height).toBe('24px')
  })

  it('reflects the data-slot attribute', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
  })

  it('forwards a ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'skeleton')
  })
})

describe('SkeletonText', () => {
  it('renders the requested number of lines', () => {
    const { container } = render(<SkeletonText lines={4} />)
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(4)
  })

  it('defaults to 3 lines', () => {
    const { container } = render(<SkeletonText />)
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3)
  })

  it('forwards a ref to the wrapper element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<SkeletonText ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
