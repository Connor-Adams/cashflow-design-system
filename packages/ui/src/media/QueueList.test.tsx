import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueueList } from './QueueList'
import type { MediaTrack } from './types'

const items: MediaTrack[] = [
  { id: 'a', title: 'First', source: 'Src', duration: 120 },
  { id: 'b', title: 'Second', duration: 200 },
]

describe('QueueList', () => {
  it('renders the queue title and count badge', () => {
    const { container } = render(<QueueList items={items} />)
    expect(screen.getByText('Queue')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="badge"]')).toHaveTextContent('2')
  })

  it('applies the ca-queue-list base class', () => {
    const { container } = render(<QueueList items={items} />)
    expect(container.querySelector('[data-slot="queue-list"]')).toHaveClass('ca-queue-list')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<QueueList className="mt-4" items={items} />)
    const root = container.querySelector('[data-slot="queue-list"]')
    expect(root).toHaveClass('ca-queue-list')
    expect(root).toHaveClass('mt-4')
  })

  it('renders each queued track', () => {
    render(<QueueList items={items} />)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('shows the empty state when there are no items', () => {
    render(<QueueList items={[]} emptyLabel="Nothing queued" />)
    expect(screen.getByText('Nothing queued')).toBeInTheDocument()
  })

  it('renders a Clear button and fires onClear', () => {
    let cleared = false
    render(<QueueList items={items} onClear={() => (cleared = true)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(cleared).toBe(true)
  })

  it('fires onRemove with the row index', () => {
    let removed = -1
    render(<QueueList items={items} onRemove={(i) => (removed = i)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove Second' }))
    expect(removed).toBe(1)
  })

  it('renders the now-playing row when provided', () => {
    render(<QueueList items={items} nowPlaying={{ title: 'Current', duration: 60 }} />)
    expect(screen.getByText('Now playing')).toBeInTheDocument()
    expect(screen.getByText('Current')).toBeInTheDocument()
  })

  it('forwards a ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<QueueList ref={ref} items={items} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveAttribute('data-slot', 'queue-list')
  })
})
