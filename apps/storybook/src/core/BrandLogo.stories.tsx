import type { Meta, StoryObj } from '@storybook/react'
import { BrandLogo, brandNames } from '@connor-adams/designsystem'

const meta: Meta<typeof BrandLogo> = {
  title: 'Core/BrandLogo',
  component: BrandLogo,
  args: { name: 'spotify', size: 32 },
  argTypes: {
    name: { control: 'select', options: brandNames },
    size: { control: { type: 'number', min: 16, max: 96, step: 4 } },
    brand: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof BrandLogo>

export const Default: Story = {}

export const BrandColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      <BrandLogo name="spotify" size={36} brand />
      <BrandLogo name="netflix" size={36} brand />
      <BrandLogo name="visa" size={36} brand />
      <BrandLogo name="paypal" size={36} brand />
      <BrandLogo name="cash-app" size={36} brand />
      <BrandLogo name="starbucks" size={36} brand />
    </div>
  ),
}

export const Monochrome: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', color: 'var(--foreground)' }}>
      <BrandLogo name="spotify" size={36} />
      <BrandLogo name="apple" size={36} />
      <BrandLogo name="github" size={36} />
      <span style={{ color: 'var(--muted-foreground)' }}><BrandLogo name="uber" size={36} /></span>
    </div>
  ),
}

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>
      {brandNames.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
          <BrandLogo name={name} size={30} brand />
          <span style={{ textAlign: 'center' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
}
