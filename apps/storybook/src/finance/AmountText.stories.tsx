import type { Meta, StoryObj } from '@storybook/react'
import { AmountText } from '@connoradams/designsystem'

const meta: Meta<typeof AmountText> = {
  title: 'Finance/AmountText',
  component: AmountText,
  args: {
    value: 4250.0,
    currency: 'CAD',
    locale: 'en-CA',
    colored: true,
    showSign: true,
    decimals: 2,
    size: 'default',
    weight: 'bold',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['in', 'out', 'zero', undefined],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
  },
}
export default meta

type Story = StoryObj<typeof AmountText>

export const Default: Story = {}

export const Expense: Story = {
  args: {
    value: -94.32,
    direction: 'out',
  },
}

export const Large: Story = {
  args: {
    value: 8500.0,
    size: 'xl',
    direction: 'in',
  },
}

export const Neutral: Story = {
  args: {
    value: 1200.0,
    colored: false,
    direction: 'zero',
  },
}
