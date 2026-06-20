import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Link } from './Link'

describe('Link', () => {
  it('renders an anchor with its children', () => {
    render(<Link href="#">Docs</Link>)
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument()
  })

  it('applies the ca-link base class', () => {
    render(<Link href="#">Docs</Link>)
    expect(screen.getByRole('link')).toHaveClass('ca-link')
  })

  it('merges a consumer className with the base class', () => {
    render(
      <Link href="#" className="font-bold">
        Docs
      </Link>,
    )
    const el = screen.getByRole('link')
    expect(el).toHaveClass('ca-link')
    expect(el).toHaveClass('font-bold')
  })

  it('defaults to the default variant', () => {
    render(<Link href="#">Docs</Link>)
    expect(screen.getByRole('link')).toHaveAttribute('data-variant', 'default')
  })

  it('reflects muted as a variant', () => {
    render(
      <Link href="#" muted>
        Docs
      </Link>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('data-variant', 'muted')
  })

  it('reflects subtle as a variant (subtle wins over muted)', () => {
    render(
      <Link href="#" subtle muted>
        Docs
      </Link>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('data-variant', 'subtle')
  })

  it('sets target and rel for external links', () => {
    render(
      <Link href="https://x.test" external>
        Out
      </Link>,
    )
    const el = screen.getByRole('link')
    expect(el).toHaveAttribute('target', '_blank')
    expect(el).toHaveAttribute('rel', 'noreferrer noopener')
  })

  it('forwards a ref to the underlying anchor', () => {
    const ref = createRef<HTMLAnchorElement>()
    render(
      <Link ref={ref} href="#">
        Docs
      </Link>,
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    expect(ref.current).toHaveAttribute('data-slot', 'link')
  })
})
