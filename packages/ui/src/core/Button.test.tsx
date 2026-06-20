import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('applies the ca-btn base class', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('ca-btn')
  })

  it('merges a consumer className with the base class', () => {
    render(<Button className="mt-4">Save</Button>)
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toHaveClass('ca-btn')
    expect(btn).toHaveClass('mt-4')
  })

  it('reflects variant and size as data attributes', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Delete' })
    expect(btn).toHaveAttribute('data-variant', 'destructive')
    expect(btn).toHaveAttribute('data-size', 'lg')
  })

  it('defaults size to "default"', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('data-size', 'default')
  })

  it('forwards a ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Save</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current).toHaveTextContent('Save')
  })

  it('defaults type to "button"', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('disables the native control', () => {
    render(<Button disabled>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
