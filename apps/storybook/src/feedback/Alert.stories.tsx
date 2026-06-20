import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from '@connoradams/designsystem'

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  args: {
    variant: 'info',
    title: 'Heads up',
    children: 'Your bank connection will expire in 3 days. Reconnect to keep syncing.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['error', 'warning', 'info', 'success'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Alert>

export const Default: Story = {}
export const Success: Story = { args: { variant: 'success', title: 'Import complete', children: '147 transactions imported successfully.' } }
export const Warning: Story = { args: { variant: 'warning', title: 'Budget exceeded', children: 'You have gone over your dining budget this month.' } }
export const Error: Story = { args: { variant: 'error', title: 'Connection failed', children: 'Could not reach your bank. Check your credentials and try again.' } }
