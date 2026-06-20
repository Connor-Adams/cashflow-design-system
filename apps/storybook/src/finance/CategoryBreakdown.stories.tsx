import type { Meta, StoryObj } from '@storybook/react'
import { CategoryBreakdown } from '@connor-adams/designsystem'

const meta: Meta<typeof CategoryBreakdown> = {
  title: 'Finance/CategoryBreakdown',
  component: CategoryBreakdown,
  args: {
    title: 'Net spend by category',
    subtitle: 'This month · transfers excluded',
    trend: [12, 9, 14, 11, 18, 16, 22],
    rows: [
      { category: 'groceries', amount: -842 },
      { category: 'dining', amount: -586 },
      { category: 'transport', amount: -418 },
      { category: 'subscriptions', amount: -214 },
      { category: 'utilities', amount: -176 },
    ],
  },
}
export default meta

type Story = StoryObj<typeof CategoryBreakdown>

export const Default: Story = {}

export const NoSparkline: Story = {
  args: { trend: undefined },
}

export const Selectable: Story = {
  args: { onSelect: (category) => console.log('selected', category) },
}
