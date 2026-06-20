import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from '@connor-adams/designsystem'

const PERIOD_ITEMS = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
]

const meta: Meta<typeof Tabs> = {
  title: 'Data/Tabs',
  component: Tabs,
  args: {
    items: PERIOD_ITEMS,
    value: 'month',
  },
}
export default meta

type Story = StoryObj<typeof Tabs>

export const Default: Story = {}

export const AccountView: Story = {
  render: () => {
    const [value, setValue] = React.useState('transactions')
    return (
      <Tabs
        items={[
          { value: 'transactions', label: 'Transactions' },
          { value: 'budgets', label: 'Budgets' },
          { value: 'analytics', label: 'Analytics' },
        ]}
        value={value}
        onValueChange={setValue}
      />
    )
  },
}
