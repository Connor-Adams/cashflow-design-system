import type { Meta, StoryObj } from '@storybook/react'
import { NativeSelect } from '@connor-adams/designsystem'

const CATEGORY_OPTIONS = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transportation' },
  { value: 'housing', label: 'Housing' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health & Wellness' },
]

const meta: Meta<typeof NativeSelect> = {
  title: 'Forms/NativeSelect',
  component: NativeSelect,
  args: {
    options: CATEGORY_OPTIONS,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
}
export default meta

type Story = StoryObj<typeof NativeSelect>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Disabled: Story = { args: { disabled: true } }
