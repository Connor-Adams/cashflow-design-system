import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from '@connor-adams/designsystem'

const meta: Meta<typeof Progress> = {
  title: 'Core/Progress',
  component: Progress,
  args: {
    value: 60,
    tone: 'primary',
    size: 'default',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Progress>

export const Default: Story = {}
export const WithLabel: Story = { args: { label: 'Budget used', showValue: true, value: 74 } }
export const Success: Story = { args: { tone: 'success', value: 100 } }
export const Warning: Story = { args: { tone: 'warning', value: 85, label: 'Dining', showValue: true } }
export const Indeterminate: Story = { args: { indeterminate: true } }
