import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@connoradams/designsystem'

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  args: {
    placeholder: 'Enter a value…',
  },
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'Hello, world' } }
export const Invalid: Story = { args: { invalid: true, defaultValue: 'bad input' } }
export const Disabled: Story = { args: { disabled: true, placeholder: 'Disabled' } }
