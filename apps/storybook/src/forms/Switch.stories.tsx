import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '@connoradams/designsystem'

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
  args: {},
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Small: Story = { args: { size: 'sm' } }
export const Disabled: Story = { args: { disabled: true } }
