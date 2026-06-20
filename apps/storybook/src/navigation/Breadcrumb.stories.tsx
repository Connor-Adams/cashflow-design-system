import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from '@connoradams/designsystem'

const ITEMS_SHORT = [
  { label: 'Home', href: '/' },
  { label: 'Settings' },
]

const ITEMS_LONG = [
  { label: 'Home', href: '/' },
  { label: 'Accounts', href: '/accounts' },
  { label: 'Checking', href: '/accounts/checking' },
  { label: 'Transactions' },
]

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: ITEMS_SHORT,
  },
}
export default meta

type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {}

export const Deep: Story = {
  args: {
    items: ITEMS_LONG,
  },
}

export const NoLinks: Story = {
  args: {
    items: [
      { label: 'Dashboard' },
      { label: 'Overview' },
    ],
  },
}
