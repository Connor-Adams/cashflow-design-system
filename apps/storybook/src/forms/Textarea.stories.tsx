import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '@connor-adams/designsystem'

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Add a note…',
  },
}
export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'Transfer to savings for upcoming vacation fund.' } }
export const Invalid: Story = { args: { invalid: true, defaultValue: 'Missing required field.' } }
export const Disabled: Story = { args: { disabled: true, placeholder: 'Disabled' } }
