import type { Meta, StoryObj } from '@storybook/react'
import { Kbd } from '@connor-adams/designsystem'

const meta: Meta<typeof Kbd> = {
  title: 'Core/Kbd',
  component: Kbd,
  args: { children: '⌘K' },
}
export default meta

type Story = StoryObj<typeof Kbd>

export const Default: Story = {}
export const SingleKey: Story = { args: { children: 'Esc' } }
export const Combo: Story = { args: { children: '⌘⇧P' } }
