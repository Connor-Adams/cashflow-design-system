import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders an img role with a name-derived label', () => {
    render(<Avatar name="Ada Lovelace" />)
    expect(screen.getByRole('img', { name: 'Avatar for Ada Lovelace' })).toBeInTheDocument()
  })

  it('shows initials when there is no src', () => {
    render(<Avatar name="Ada Lovelace" />)
    expect(screen.getByText('AL')).toBeInTheDocument()
  })

  it('carries the fallback static styling on a CSS class, not inline', () => {
    render(<Avatar name="Ada Lovelace" />)
    const fallback = screen.getByText('AL')
    expect(fallback).toHaveClass('ca-avatar__fallback')
    // only the genuinely-dynamic font size remains inline
    const inline = fallback.getAttribute('style') ?? ''
    expect(inline).not.toMatch(/user-select|align-items|font-family/)
  })

  it('applies the ca-avatar base class', () => {
    render(<Avatar name="Ada" />)
    expect(screen.getByRole('img')).toHaveClass('ca-avatar')
  })

  it('merges a consumer className with the base class', () => {
    render(<Avatar name="Ada" className="shadow" />)
    const el = screen.getByRole('img')
    expect(el).toHaveClass('ca-avatar')
    expect(el).toHaveClass('shadow')
  })

  it('reflects a named size as data-size', () => {
    render(<Avatar name="Ada" size="lg" />)
    expect(screen.getByRole('img')).toHaveAttribute('data-size', 'lg')
  })

  it('omits data-size for a numeric size', () => {
    render(<Avatar name="Ada" size={40} />)
    expect(screen.getByRole('img')).not.toHaveAttribute('data-size')
  })

  it('forwards a ref to the underlying span', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Avatar ref={ref} name="Ada" />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveAttribute('data-slot', 'avatar')
  })
})
