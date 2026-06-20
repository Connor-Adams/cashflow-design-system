import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  it('renders its children with the ca-label base class', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toHaveClass('ca-label')
  })

  it('merges a consumer className with the base class', () => {
    render(<Label className="mt-4">Email</Label>)
    const el = screen.getByText('Email')
    expect(el).toHaveClass('ca-label')
    expect(el).toHaveClass('mt-4')
  })

  it('carries the label data-slot', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toHaveAttribute('data-slot', 'label')
  })

  it('forwards a ref to the underlying label element', () => {
    const ref = createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Email</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
    expect(ref.current).toHaveTextContent('Email')
  })

  it('spreads htmlFor onto the native control', () => {
    render(<Label htmlFor="email-field">Email</Label>)
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-field')
  })
})
