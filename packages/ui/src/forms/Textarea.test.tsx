import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a textbox with the ca-textarea base class', () => {
    render(<Textarea aria-label="Notes" />)
    expect(screen.getByLabelText('Notes')).toHaveClass('ca-textarea')
  })

  it('merges a consumer className with the base class', () => {
    render(<Textarea aria-label="Notes" className="mt-4" />)
    const el = screen.getByLabelText('Notes')
    expect(el).toHaveClass('ca-textarea')
    expect(el).toHaveClass('mt-4')
  })

  it('reflects invalid as aria-invalid', () => {
    render(<Textarea aria-label="Notes" invalid />)
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true')
  })

  it('carries the textarea data-slot', () => {
    render(<Textarea aria-label="Notes" />)
    expect(screen.getByLabelText('Notes')).toHaveAttribute('data-slot', 'textarea')
  })

  it('forwards a ref to the underlying textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea aria-label="Notes" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('spreads value/onChange wiring onto the native control', () => {
    render(<Textarea aria-label="Notes" value="hi" onChange={() => {}} />)
    expect(screen.getByLabelText('Notes')).toHaveValue('hi')
  })
})
