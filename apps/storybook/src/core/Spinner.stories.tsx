import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from '@connor-adams/designsystem'

const meta: Meta<typeof Spinner> = {
  title: 'Core/Spinner',
  component: Spinner,
  args: {
    size: 'default',
    tone: 'primary',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    tone: {
      control: 'select',
      options: [
        'current',
        'primary',
        'muted',
        'gradient-current',
        'gradient-primary',
        'gradient-muted',
        'hero',
      ],
    },
  },
}
export default meta

type Story = StoryObj<typeof Spinner>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm', tone: 'muted' } }
export const Large: Story = { args: { size: 'lg' } }
export const Gradient: Story = { args: { size: 'lg', tone: 'gradient-primary' } }
export const Hero: Story = { args: { size: 'lg', tone: 'hero' } }
