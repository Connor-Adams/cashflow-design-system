import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders the trigger with the ca-tooltip base class on the root', () => {
    render(
      <Tooltip content="Hi">
        <button>Trigger</button>
      </Tooltip>,
    )
    const root = document.querySelector('[data-slot="tooltip"]')
    expect(root).not.toBeNull()
    expect(root).toHaveClass('ca-tooltip')
  })

  it('merges a consumer className onto the root', () => {
    render(
      <Tooltip content="Hi" className="inline-x">
        <button>Trigger</button>
      </Tooltip>,
    )
    const root = document.querySelector('[data-slot="tooltip"]')!
    expect(root).toHaveClass('ca-tooltip')
    expect(root).toHaveClass('inline-x')
  })

  it('keeps static styling in CSS so a className can override it (no inline style attr)', () => {
    render(
      <Tooltip content="Hi" className="inline-x" side="right">
        <button>Trigger</button>
      </Tooltip>,
    )
    // Root carries only ...style (none here) — no static inline style competes with the class.
    expect(document.querySelector('[data-slot="tooltip"]')).not.toHaveAttribute('style')
    // Bubble placement is CSS-driven off data-side; no static inline style on it either.
    fireEvent.mouseEnter(document.querySelector('[data-slot="tooltip"]')!)
    expect(screen.getByRole('tooltip')).not.toHaveAttribute('style')
  })

  it('still honours a consumer style prop via the ...style spread', () => {
    render(
      <Tooltip content="Hi" style={{ opacity: 0.5 }}>
        <button>Trigger</button>
      </Tooltip>,
    )
    expect(document.querySelector('[data-slot="tooltip"]')).toHaveStyle({ opacity: '0.5' })
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <Tooltip ref={ref} content="Hi">
        <button>Trigger</button>
      </Tooltip>,
    )
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveAttribute('data-slot', 'tooltip')
  })

  it('is hidden by default and shows the bubble on hover', () => {
    render(
      <Tooltip content="Bubble text">
        <button>Trigger</button>
      </Tooltip>,
    )
    expect(screen.queryByRole('tooltip')).toBeNull()
    fireEvent.mouseEnter(document.querySelector('[data-slot="tooltip"]')!)
    expect(screen.getByRole('tooltip')).toHaveTextContent('Bubble text')
  })

  it('hides the bubble on mouse leave', () => {
    render(
      <Tooltip content="Bubble text">
        <button>Trigger</button>
      </Tooltip>,
    )
    const root = document.querySelector('[data-slot="tooltip"]')!
    fireEvent.mouseEnter(root)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.mouseLeave(root)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('shows the bubble on keyboard focus and hides on blur', () => {
    render(
      <Tooltip content="Bubble text">
        <button>Trigger</button>
      </Tooltip>,
    )
    const root = document.querySelector('[data-slot="tooltip"]')!
    fireEvent.focus(root)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.blur(root)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('reflects side as a data attribute on the bubble', () => {
    render(
      <Tooltip content="Hi" side="right">
        <button>Trigger</button>
      </Tooltip>,
    )
    fireEvent.mouseEnter(document.querySelector('[data-slot="tooltip"]')!)
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-side', 'right')
  })
})
