import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '@connoradams/designsystem'

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  args: {
    title: 'No transactions yet',
    description: 'Connect a bank account to start importing your transactions.',
  },
  argTypes: {
    actions: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}
export const TitleOnly: Story = { args: { title: 'No results found', description: undefined } }
export const WithActions: Story = {
  args: {
    title: 'No accounts connected',
    description: 'Link a bank or credit card to see your cash flow.',
    actions: <button style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontSize: 'var(--text-body-sm)' }}>Connect account</button>,
  },
}
