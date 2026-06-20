import type { Meta, StoryObj } from '@storybook/react'
import { Stepper } from '@connoradams/designsystem'

const meta: Meta<typeof Stepper> = {
  title: 'Forms/Stepper',
  component: Stepper,
  args: {
    defaultValue: 3,
    min: 0,
    max: 20,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Stepper>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Disabled: Story = { args: { disabled: true } }
