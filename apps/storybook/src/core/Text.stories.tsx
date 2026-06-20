import type { Meta, StoryObj } from '@storybook/react'
import { Text } from '@connoradams/designsystem'

const meta: Meta<typeof Text> = {
  title: 'Core/Text',
  component: Text,
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    variant: 'body',
    tone: 'default',
    weight: 'regular',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display-lg', 'display', 'display-sm',
        'headline-lg', 'headline', 'headline-sm',
        'body-lg', 'body', 'body-sm',
        'label',
      ],
    },
    tone: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'positive', 'negative', 'inherit'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Text>

export const Default: Story = {}
export const Headline: Story = { args: { variant: 'headline', children: 'Monthly Budget Overview' } }
export const DisplayLg: Story = { args: { variant: 'display-lg', children: '$12,400.00' } }
export const Muted: Story = { args: { tone: 'muted', variant: 'body-sm', children: 'Last updated 2 hours ago' } }
export const Label: Story = { args: { variant: 'label', children: 'Category' } }
export const Positive: Story = { args: { tone: 'positive', weight: 'semibold', children: '+$340.00' } }
export const Negative: Story = { args: { tone: 'negative', weight: 'semibold', children: '-$85.20' } }
