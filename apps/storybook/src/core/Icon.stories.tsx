import type { Meta, StoryObj } from '@storybook/react'
import { Icon, iconNames } from '@connor-adams/designsystem'

const meta: Meta<typeof Icon> = {
  title: 'Core/Icon',
  component: Icon,
  args: { name: 'wallet', size: 24 },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
    strokeWidth: { control: { type: 'number', min: 1, max: 3, step: 0.25 } },
  },
}
export default meta

type Story = StoryObj<typeof Icon>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon name="trending-up" size={16} />
      <Icon name="trending-up" size={24} />
      <Icon name="trending-up" size={32} />
      <Icon name="trending-up" size={48} />
    </div>
  ),
}

export const InheritsColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <span style={{ color: 'var(--positive)' }}><Icon name="trending-up" size={28} /></span>
      <span style={{ color: 'var(--destructive)' }}><Icon name="trending-down" size={28} /></span>
      <span style={{ color: 'var(--muted-foreground)' }}><Icon name="settings" size={28} /></span>
    </div>
  ),
}

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18 }}>
      {iconNames.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
          <Icon name={name} size={24} />
          <span style={{ textAlign: 'center' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
}
