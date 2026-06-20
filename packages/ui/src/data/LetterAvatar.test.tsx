import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { LetterAvatar } from './LetterAvatar'

describe('LetterAvatar', () => {
  it('renders the first letter, uppercased', () => {
    render(<LetterAvatar text="acme" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('applies the ca-letter-avatar base class', () => {
    render(<LetterAvatar text="Acme" />)
    expect(screen.getByRole('img')).toHaveClass('ca-letter-avatar')
  })

  it('merges a consumer className with the base class', () => {
    render(<LetterAvatar text="Acme" className="ml-2" />)
    const el = screen.getByRole('img')
    expect(el).toHaveClass('ca-letter-avatar')
    expect(el).toHaveClass('ml-2')
  })

  it('reflects size as a data attribute', () => {
    render(<LetterAvatar text="Acme" size="lg" />)
    expect(screen.getByRole('img')).toHaveAttribute('data-size', 'lg')
  })

  it('defaults size to "md"', () => {
    render(<LetterAvatar text="Acme" />)
    expect(screen.getByRole('img')).toHaveAttribute('data-size', 'md')
  })

  it('exposes an accessible label', () => {
    render(<LetterAvatar text="Acme" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Avatar for Acme')
  })

  it('forwards a ref to the underlying span element', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<LetterAvatar text="Acme" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveTextContent('A')
  })

  it('assigns the same color for the same text (deterministic hash)', () => {
    const { rerender } = render(<LetterAvatar text="Acme" />)
    const first = screen.getByRole('img').getAttribute('style')
    rerender(<LetterAvatar text="Acme" />)
    expect(screen.getByRole('img').getAttribute('style')).toBe(first)
  })
})
