import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { StatCard, resolveDeltaTone } from './StatCard'

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Revenue" value="$12,400" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$12,400')).toBeInTheDocument()
  })

  it('applies the ca-stat-card base class', () => {
    const { container } = render(<StatCard label="Revenue" value="$1" />)
    expect(container.querySelector('[data-slot="stat-card"]')).toHaveClass('ca-stat-card')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<StatCard label="Revenue" value="$1" className="w-full" />)
    const el = container.querySelector('[data-slot="stat-card"]')
    expect(el).toHaveClass('ca-stat-card')
    expect(el).toHaveClass('w-full')
  })

  it('forwards a ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<StatCard ref={ref} label="Revenue" value="$1" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'stat-card')
  })

  it('reflects the resolved delta tone on the delta chip', () => {
    const { container } = render(
      <StatCard label="Spend" value="$1" delta="+12%" metricKind="spend" />,
    )
    // spend + positive sign => negative tone
    expect(container.querySelector('[data-slot="stat-card-delta"]')).toHaveAttribute('data-tone', 'negative')
  })

  it('omits the delta chip when no delta is provided', () => {
    const { container } = render(<StatCard label="Revenue" value="$1" />)
    expect(container.querySelector('[data-slot="stat-card-delta"]')).toBeNull()
  })

  it('resolveDeltaTone inverts for spend and passes through for gain', () => {
    expect(resolveDeltaTone('positive', 'gain')).toBe('positive')
    expect(resolveDeltaTone('positive', 'spend')).toBe('negative')
    expect(resolveDeltaTone('negative', 'spend')).toBe('positive')
    expect(resolveDeltaTone('positive', 'neutral')).toBe('neutral')
  })
})
