import type { Meta, StoryObj } from '@storybook/react'
import { Sparkline } from '@connoradams/designsystem'

const meta: Meta<typeof Sparkline> = {
  title: 'Finance/Sparkline',
  component: Sparkline,
  args: {
    data: [3, 7, 4, 9, 6, 11, 8],
    width: 96,
    height: 28,
    area: true,
    dot: true,
    strokeWidth: 2,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['positive', 'negative', 'neutral', 'primary', undefined],
    },
  },
}
export default meta

type Story = StoryObj<typeof Sparkline>

export const Default: Story = {}

export const Negative: Story = {
  args: {
    data: [11, 9, 8, 6, 5, 3, 2],
    tone: 'negative',
  },
}

export const Neutral: Story = {
  args: {
    data: [5, 6, 4, 7, 5, 6, 5],
    tone: 'neutral',
  },
}

export const Large: Story = {
  args: {
    data: [3, 7, 4, 9, 6, 11, 8],
    width: 160,
    height: 48,
  },
}

export const NoArea: Story = {
  args: {
    data: [3, 7, 4, 9, 6, 11, 8],
    area: false,
    dot: false,
  },
}
