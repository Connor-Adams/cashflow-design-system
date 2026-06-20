import type { Meta, StoryObj } from '@storybook/react'
import { Link } from '@connoradams/designsystem'

const meta: Meta<typeof Link> = {
  title: 'Core/Link',
  component: Link,
  args: {
    children: 'View transactions',
    href: '#',
  },
}
export default meta

type Story = StoryObj<typeof Link>

export const Default: Story = {}
export const Muted: Story = { args: { muted: true, children: 'Learn more' } }
export const Subtle: Story = { args: { subtle: true, children: 'See details' } }
export const External: Story = { args: { external: true, children: 'Cashflow Docs', href: 'https://example.com' } }
