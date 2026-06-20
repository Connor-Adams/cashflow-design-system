import type { Meta, StoryObj } from '@storybook/react'
import { Toast } from '@connoradams/designsystem'

const meta: Meta<typeof Toast> = {
  title: 'Overlays/Toast',
  component: Toast,
  args: {
    variant: 'default',
    title: 'Changes saved',
    children: 'Your settings have been updated successfully.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Toast>

export const Default: Story = {}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Transaction imported',
    children: '142 transactions were added to your account.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Import failed',
    children: 'The file format is not supported. Please upload a CSV.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Budget exceeded',
    children: 'You have exceeded your monthly dining budget by $24.',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Sync in progress',
    children: 'Fetching the latest transactions from your bank.',
  },
}
