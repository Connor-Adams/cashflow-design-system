import type { Meta, StoryObj } from '@storybook/react'
import { AccountCard } from '@connor-adams/designsystem'

const meta: Meta<typeof AccountCard> = {
  title: 'Finance/AccountCard',
  component: AccountCard,
  args: {
    name: 'TD Everyday Chequing',
    institution: 'TD',
    mask: '4321',
    balance: 4820.5,
    currency: 'CAD',
    locale: 'en-CA',
    kind: 'chequing',
    status: 'synced',
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['chequing', 'savings', 'credit', 'investment', 'cash', 'default'],
    },
    status: {
      control: 'select',
      options: ['synced', 'syncing', 'error'],
    },
  },
}
export default meta

type Story = StoryObj<typeof AccountCard>

export const Default: Story = {}

export const Savings: Story = {
  args: {
    name: 'High-Interest Savings',
    institution: 'EQ Bank',
    mask: '9901',
    balance: 12340.0,
    kind: 'savings',
    status: 'synced',
  },
}

export const CreditCard: Story = {
  args: {
    name: 'Scotiabank Visa',
    institution: 'Scotia',
    mask: '7788',
    balance: -1480.25,
    kind: 'credit',
    status: 'synced',
  },
}

export const SyncError: Story = {
  args: {
    name: 'BMO Investment Account',
    institution: 'BMO',
    mask: '5512',
    balance: 34200.0,
    kind: 'investment',
    status: 'error',
  },
}
