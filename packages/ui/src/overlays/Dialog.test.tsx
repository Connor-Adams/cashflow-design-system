import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('renders nothing when closed', () => {
    render(<Dialog open={false}>Body</Dialog>)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders the dialog with the ca-dialog base class on the content card', () => {
    render(
      <Dialog open title="Confirm">
        Body
      </Dialog>,
    )
    const card = document.querySelector('[data-slot="dialog-content"]')
    expect(card).not.toBeNull()
    expect(card).toHaveClass('ca-dialog')
  })

  it('merges a consumer className onto the content card', () => {
    render(
      <Dialog open className="custom-x">
        Body
      </Dialog>,
    )
    const card = document.querySelector('[data-slot="dialog-content"]')!
    expect(card).toHaveClass('ca-dialog')
    expect(card).toHaveClass('custom-x')
  })

  it('keeps static styling in CSS so a className can override it (no inline style attr)', () => {
    render(
      <Dialog open className="custom-x">
        Body
      </Dialog>,
    )
    // No static inline style competing with the class — the consumer className wins.
    expect(document.querySelector('[data-slot="dialog-content"]')).not.toHaveAttribute('style')
    expect(document.querySelector('[data-slot="dialog-scrim"]')).not.toHaveAttribute('style')
  })

  it('still honours a consumer style prop via the ...style spread', () => {
    render(
      <Dialog open style={{ zIndex: 99 }}>
        Body
      </Dialog>,
    )
    expect(document.querySelector('[data-slot="dialog-content"]')).toHaveStyle({ zIndex: '99' })
  })

  it('reflects size as a data attribute', () => {
    render(
      <Dialog open size="lg">
        Body
      </Dialog>,
    )
    expect(document.querySelector('[data-slot="dialog-content"]')).toHaveAttribute('data-size', 'lg')
  })

  it('defaults size to "default"', () => {
    render(<Dialog open>Body</Dialog>)
    expect(document.querySelector('[data-slot="dialog-content"]')).toHaveAttribute('data-size', 'default')
  })

  it('forwards a ref to the content card element', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Dialog open ref={ref}>
        Body
      </Dialog>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'dialog-content')
  })

  it('calls onClose on Escape', () => {
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose}>
        Body
      </Dialog>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the scrim is clicked', () => {
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose}>
        Body
      </Dialog>,
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when the content card is clicked', () => {
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose}>
        Body
      </Dialog>,
    )
    fireEvent.click(document.querySelector('[data-slot="dialog-content"]')!)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders title, description, and footer', () => {
    render(
      <Dialog open title="The Title" description="The Desc" footer={<button>OK</button>}>
        Body
      </Dialog>,
    )
    expect(screen.getByText('The Title')).toBeInTheDocument()
    expect(screen.getByText('The Desc')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })
})
