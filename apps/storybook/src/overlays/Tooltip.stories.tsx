import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from '@connoradams/designsystem'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  args: {
    content: 'Helpful information',
    side: 'top',
    children: <button type="button" style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)', cursor: 'pointer' }}>Hover me</button>,
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {}

export const Bottom: Story = {
  args: {
    side: 'bottom',
    content: 'Appears below',
  },
}

export const Left: Story = {
  args: {
    side: 'left',
    content: 'Appears to the left',
  },
}

export const Right: Story = {
  args: {
    side: 'right',
    content: 'Appears to the right',
  },
}
