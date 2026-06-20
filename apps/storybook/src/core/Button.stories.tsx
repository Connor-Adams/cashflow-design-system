import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@connoradams/designsystem'

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Destructive: Story = { args: { variant: 'destructive' } }
export const Large: Story = { args: { size: 'lg' } }
export const Disabled: Story = { args: { disabled: true } }
