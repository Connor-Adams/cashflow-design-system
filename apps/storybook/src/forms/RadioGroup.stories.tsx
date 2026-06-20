import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup } from '@connoradams/designsystem'

const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

const meta: Meta<typeof RadioGroup> = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  args: {
    options: PERIOD_OPTIONS,
    defaultValue: 'monthly',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
}
export default meta

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {}
export const Horizontal: Story = { args: { orientation: 'horizontal' } }
export const Disabled: Story = { args: { disabled: true } }
