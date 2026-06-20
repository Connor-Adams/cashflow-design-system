import type { Meta, StoryObj } from '@storybook/react'
import { PeriodSelector } from '@connoradams/designsystem'

const meta: Meta<typeof PeriodSelector> = {
  title: 'Finance/PeriodSelector',
  component: PeriodSelector,
  args: {
    value: 'this-month',
    size: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default'],
    },
  },
}
export default meta

type Story = StoryObj<typeof PeriodSelector>

export const Default: Story = {}

export const LastThirtyDays: Story = {
  args: {
    value: 'last-30',
  },
}

export const YearToDate: Story = {
  args: {
    value: 'ytd',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    value: 'this-quarter',
  },
}
