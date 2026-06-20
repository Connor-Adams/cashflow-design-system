import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renders elapsed and total time labels', () => {
    render(<ProgressBar currentTime={75} duration={200} />)
    expect(screen.getByText('1:15')).toBeInTheDocument()
    expect(screen.getByText('3:20')).toBeInTheDocument()
  })

  it('applies the ca-progress-bar base class', () => {
    const { container } = render(<ProgressBar currentTime={0} duration={100} />)
    expect(container.querySelector('[data-slot="progress-bar"]')).toHaveClass('ca-progress-bar')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<ProgressBar className="mt-4" currentTime={0} duration={100} />)
    const root = container.querySelector('[data-slot="progress-bar"]')
    expect(root).toHaveClass('ca-progress-bar')
    expect(root).toHaveClass('mt-4')
  })

  it('renders a non-interactive progressbar when onSeek is omitted', () => {
    render(<ProgressBar currentTime={50} duration={100} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '50')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders a slider when seekable', () => {
    render(<ProgressBar currentTime={50} duration={100} onSeek={() => {}} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('invokes onSeek with the clicked position in whole seconds (seek behavior preserved)', () => {
    let seeked = -1
    render(<ProgressBar currentTime={0} duration={100} onSeek={(s) => (seeked = s)} />)
    const bar = screen.getByRole('slider')
    bar.getBoundingClientRect = () =>
      ({ left: 0, width: 200, top: 0, height: 8, right: 200, bottom: 8, x: 0, y: 0, toJSON: () => {} }) as DOMRect
    fireEvent.click(bar, { clientX: 100 })
    expect(seeked).toBe(50)
  })

  it('does not invoke onSeek when not seekable', () => {
    let called = false
    render(<ProgressBar currentTime={0} duration={0} onSeek={() => (called = true)} />)
    const bar = screen.getByRole('progressbar')
    fireEvent.click(bar, { clientX: 100 })
    expect(called).toBe(false)
  })

  it('forwards a ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<ProgressBar ref={ref} currentTime={0} duration={100} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'progress-bar')
  })
})
