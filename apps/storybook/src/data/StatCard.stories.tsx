import type { Meta, StoryObj } from '@storybook/react'
import { StatCard } from '@connor-adams/designsystem'

const meta: Meta<typeof StatCard> = {
  title: 'Data/StatCard',
  component: StatCard,
  args: {
    label: 'Total Spending',
    value: '$3,240.00',
    delta: '+$340',
    metricKind: 'spend',
  },
  argTypes: {
    metricKind: {
      control: 'select',
      options: ['gain', 'spend', 'neutral'],
    },
  },
}
export default meta

type Story = StoryObj<typeof StatCard>

export const Default: Story = {}

export const Income: Story = {
  args: {
    label: 'Total Income',
    value: '$8,500.00',
    delta: '+$650',
    metricKind: 'gain',
    hint: 'vs. last month',
  },
}

export const NetSavings: Story = {
  args: {
    label: 'Net Savings',
    value: '$2,180.00',
    delta: '+12%',
    metricKind: 'gain',
    hint: 'After all expenses',
  },
}

export const Neutral: Story = {
  args: {
    label: 'Transactions',
    value: '142',
    delta: '+8',
    metricKind: 'neutral',
    hint: 'This month',
  },
}
