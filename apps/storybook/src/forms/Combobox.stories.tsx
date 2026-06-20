import type { Meta, StoryObj } from '@storybook/react'
import { Combobox } from '@connoradams/designsystem'

const ACCOUNT_OPTIONS = [
  { value: 'checking', label: 'Checking', hint: '••4521' },
  { value: 'savings', label: 'Savings', hint: '••8830' },
  { value: 'credit', label: 'Credit Card', hint: '••1234' },
  { value: 'investment', label: 'Investment', hint: '••9977' },
]

const meta: Meta<typeof Combobox> = {
  title: 'Forms/Combobox',
  component: Combobox,
  args: {
    options: ACCOUNT_OPTIONS,
    placeholder: 'Search accounts…',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Combobox>

export const Default: Story = {}
export const WithDefaultValue: Story = { args: { defaultValue: 'savings' } }
export const Small: Story = { args: { size: 'sm' } }
