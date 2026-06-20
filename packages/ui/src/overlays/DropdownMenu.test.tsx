import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { DropdownMenu, type DropdownItem } from './DropdownMenu'

const items: DropdownItem[] = [
  { label: 'Edit', onSelect: () => {} },
  { separator: true },
  { label: 'Delete', danger: true, onSelect: () => {} },
]

describe('DropdownMenu', () => {
  it('renders the trigger with the ca-dropdown base class on the root', () => {
    render(<DropdownMenu trigger={<button>Open</button>} items={items} />)
    const root = document.querySelector('[data-slot="dropdown-menu"]')
    expect(root).not.toBeNull()
    expect(root).toHaveClass('ca-dropdown')
  })

  it('merges a consumer className onto the root', () => {
    render(<DropdownMenu trigger={<button>Open</button>} items={items} className="inline-x" />)
    const root = document.querySelector('[data-slot="dropdown-menu"]')!
    expect(root).toHaveClass('ca-dropdown')
    expect(root).toHaveClass('inline-x')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<DropdownMenu ref={ref} trigger={<button>Open</button>} items={items} />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveAttribute('data-slot', 'dropdown-menu')
  })

  it('is closed by default and opens on trigger click', () => {
    render(<DropdownMenu trigger={<button>Open</button>} items={items} />)
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('reflects align as a data attribute on the menu', () => {
    render(<DropdownMenu trigger={<button>Open</button>} items={items} align="end" />)
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('menu')).toHaveAttribute('data-align', 'end')
  })

  it('renders items and reflects danger as a data attribute', () => {
    render(<DropdownMenu trigger={<button>Open</button>} items={items} />)
    fireEvent.click(screen.getByText('Open'))
    const del = screen.getByRole('menuitem', { name: 'Delete' })
    expect(del).toHaveAttribute('data-danger', 'true')
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveAttribute('data-danger', 'false')
  })

  it('closes and fires onSelect when an item is clicked', () => {
    const onSelect = vi.fn()
    render(
      <DropdownMenu trigger={<button>Open</button>} items={[{ label: 'Edit', onSelect }]} />,
    )
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('does not fire onSelect for a disabled item', () => {
    const onSelect = vi.fn()
    render(
      <DropdownMenu trigger={<button>Open</button>} items={[{ label: 'Edit', onSelect, disabled: true }]} />,
    )
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('closes on Escape', () => {
    render(<DropdownMenu trigger={<button>Open</button>} items={items} />)
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('closes on outside click', () => {
    render(<DropdownMenu trigger={<button>Open</button>} items={items} />)
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
