import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton, SkeletonText } from '@connor-adams/designsystem'

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  args: {
    w: '100%',
    h: 16,
  },
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {}

export const Block: Story = {
  args: { w: 200, h: 80 },
}

export const TextLines: Story = {
  render: () => <SkeletonText lines={4} />,
}

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <Skeleton h={24} w="60%" />
      <SkeletonText lines={3} />
    </div>
  ),
}
