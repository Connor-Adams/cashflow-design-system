import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { ImportDropzone } from './ImportDropzone'

describe('ImportDropzone', () => {
  it('applies the ca-import-dropzone base class', () => {
    render(<ImportDropzone data-testid="dz" />)
    expect(screen.getByTestId('dz')).toHaveClass('ca-import-dropzone')
  })

  it('merges a consumer className with the base class', () => {
    render(<ImportDropzone className="w-full" data-testid="dz" />)
    const el = screen.getByTestId('dz')
    expect(el).toHaveClass('ca-import-dropzone')
    expect(el).toHaveClass('w-full')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<ImportDropzone ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('exposes the dropzone as a button role', () => {
    render(<ImportDropzone />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders the hint text', () => {
    render(<ImportDropzone hint="My custom hint" />)
    expect(screen.getByText('My custom hint')).toBeInTheDocument()
  })
})
