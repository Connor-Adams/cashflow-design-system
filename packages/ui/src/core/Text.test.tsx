import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders its children', () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies the ca-text base class', () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText('Hello')).toHaveClass('ca-text')
  })

  it('merges a consumer className with the base class', () => {
    render(<Text className="mb-2">Hello</Text>)
    const el = screen.getByText('Hello')
    expect(el).toHaveClass('ca-text')
    expect(el).toHaveClass('mb-2')
  })

  it('reflects the variant as a data attribute', () => {
    render(<Text variant="headline">Hi</Text>)
    expect(screen.getByText('Hi')).toHaveAttribute('data-variant', 'headline')
  })

  it('renders the default tag for a variant', () => {
    render(<Text variant="display-lg">Big</Text>)
    expect(screen.getByText('Big').tagName).toBe('H1')
  })

  it('honors the `as` tag override', () => {
    render(<Text as="span">Inline</Text>)
    expect(screen.getByText('Inline').tagName).toBe('SPAN')
  })

  it('forwards a ref to the rendered element', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Text ref={ref} as="span">
        Ref
      </Text>,
    )
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveAttribute('data-slot', 'text')
  })
})
