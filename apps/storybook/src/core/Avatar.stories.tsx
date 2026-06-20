import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '@connor-adams/designsystem'

const meta: Meta<typeof Avatar> = {
  title: 'Core/Avatar',
  component: Avatar,
  args: {
    name: 'Connor Adams',
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'select',
      options: ['online', 'away', 'offline'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Avatar>

export const Default: Story = {}
export const WithStatus: Story = { args: { status: 'online' } }
export const WithRing: Story = { args: { ring: true, status: 'away' } }
export const Large: Story = { args: { size: 'xl' } }
