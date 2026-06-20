import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Label, Input } from '@connoradams/designsystem'

const meta: Meta<typeof Label> = {
  title: 'Forms/Label',
  component: Label,
  args: {
    children: 'Account name',
  },
}
export default meta

type Story = StoryObj<typeof Label>

export const Default: Story = {}
export const WrappingInput: Story = {
  render: () => (
    <Label htmlFor="acct">
      Account name
      <Input id="acct" placeholder="e.g. My Checking" />
    </Label>
  ),
}
