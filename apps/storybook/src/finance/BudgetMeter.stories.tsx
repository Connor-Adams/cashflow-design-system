import type { Meta, StoryObj } from '@storybook/react'
import { BudgetMeter } from '@connoradams/designsystem'

const meta: Meta<typeof BudgetMeter> = {
  title: 'Finance/BudgetMeter',
  component: BudgetMeter,
  args: {
    label: 'Groceries',
    spent: 320,
    limit: 500,
    currency: 'CAD',
    locale: 'en-CA',
  },
}
export default meta

type Story = StoryObj<typeof BudgetMeter>

export const Default: Story = {}

export const NearLimit: Story = {
  args: {
    label: 'Dining Out',
    spent: 445,
    limit: 500,
  },
}

export const OverBudget: Story = {
  args: {
    label: 'Entertainment',
    spent: 620,
    limit: 400,
  },
}

export const Untouched: Story = {
  args: {
    label: 'Travel',
    spent: 0,
    limit: 1200,
  },
}
