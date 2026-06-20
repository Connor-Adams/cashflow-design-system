import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '@connor-adams/designsystem'

const meta: Meta<typeof Badge> = {
  title: 'Core/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'count'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } }
export const Success: Story = { args: { variant: 'success', children: 'Paid' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Overdue' } }
export const Outline: Story = { args: { variant: 'outline', children: 'Pending' } }
export const Count: Story = { args: { variant: 'count', children: '12' } }
