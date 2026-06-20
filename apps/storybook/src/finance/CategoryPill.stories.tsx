import type { Meta, StoryObj } from '@storybook/react'
import { CategoryPill } from '@connoradams/designsystem'

const meta: Meta<typeof CategoryPill> = {
  title: 'Finance/CategoryPill',
  component: CategoryPill,
  args: {
    category: 'groceries',
    size: 'default',
    interactive: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default'],
    },
    category: {
      control: 'select',
      options: ['groceries', 'income', 'dining', 'transport', 'subscriptions', 'utilities', 'fees', 'housing', 'default'],
    },
  },
}
export default meta

type Story = StoryObj<typeof CategoryPill>

export const Default: Story = {}

export const Income: Story = {
  args: { category: 'income' },
}

export const Transport: Story = {
  args: { category: 'transport' },
}

export const Interactive: Story = {
  args: { category: 'dining', interactive: true },
}

export const Small: Story = {
  args: { category: 'subscriptions', size: 'sm' },
}
