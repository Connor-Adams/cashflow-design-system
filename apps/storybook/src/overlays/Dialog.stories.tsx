import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Dialog } from '@connoradams/designsystem'

const meta: Meta<typeof Dialog> = {
  title: 'Overlays/Dialog',
  component: Dialog,
  args: {
    open: true,
    title: 'Confirm action',
    description: 'This action cannot be undone. Are you sure you want to continue?',
    size: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {}

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Delete account',
    description: 'Your account and all associated data will be permanently removed.',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Import transactions',
    description: 'Upload a CSV file to import your transactions.',
    children: <p style={{ margin: 0 }}>Drop your file here or click to browse.</p>,
  },
}

export const WithFooter: Story = {
  args: {
    title: 'Save changes',
    description: 'Your unsaved changes will be lost if you navigate away.',
    footer: (
      <>
        <button type="button" style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
        <button type="button" style={{ padding: '6px 14px', border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: 'var(--primary-foreground)', cursor: 'pointer' }}>Confirm</button>
      </>
    ),
  },
}
