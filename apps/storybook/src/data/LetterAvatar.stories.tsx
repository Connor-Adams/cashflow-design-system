import type { Meta, StoryObj } from '@storybook/react'
import { LetterAvatar } from '@connoradams/designsystem'

const meta: Meta<typeof LetterAvatar> = {
  title: 'Data/LetterAvatar',
  component: LetterAvatar,
  args: { text: 'Acme Corp', size: 'md' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
}
export default meta

type Story = StoryObj<typeof LetterAvatar>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm', text: 'TD Bank' } }
export const Large: Story = { args: { size: 'lg', text: 'Scotiabank' } }
export const ExtraLarge: Story = { args: { size: 'xl', text: 'Royal Bank' } }
