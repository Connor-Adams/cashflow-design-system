import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from '@connor-adams/designsystem'

const meta: Meta<typeof Separator> = {
  title: 'Core/Separator',
  component: Separator,
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Separator>

export const Default: Story = {}
export const WithLabel: Story = { args: { label: 'or continue with' } }
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
      <span>Income</span>
      <Separator orientation="vertical" />
      <span>Expenses</span>
    </div>
  ),
}
