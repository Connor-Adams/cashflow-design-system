import type { Meta, StoryObj } from '@storybook/react'
import { ToggleGroup } from '@connoradams/designsystem'

const VIEW_ITEMS = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'chart', label: 'Chart' },
]

const FILTER_ITEMS = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
]

const meta: Meta<typeof ToggleGroup> = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  args: {
    items: VIEW_ITEMS,
    defaultValue: 'list',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
}
export default meta

type Story = StoryObj<typeof ToggleGroup>

export const Default: Story = {}
export const Multiple: Story = {
  args: {
    items: FILTER_ITEMS,
    type: 'multiple',
    defaultValue: ['income', 'expense'],
  },
}
export const Small: Story = { args: { size: 'sm' } }
