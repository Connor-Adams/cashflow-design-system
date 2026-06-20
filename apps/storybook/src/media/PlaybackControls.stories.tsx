import type { Meta, StoryObj } from '@storybook/react'
import { PlaybackControls } from '@connor-adams/designsystem'

const noop = () => {}
const meta: Meta<typeof PlaybackControls> = {
  title: 'Media/PlaybackControls',
  component: PlaybackControls,
  args: { isPaused: false, isLoading: false, onPlayPause: noop, onSkip: noop, onPrevious: noop },
}
export default meta

type Story = StoryObj<typeof PlaybackControls>

export const Playing: Story = {}
export const Paused: Story = { args: { isPaused: true } }
export const Loading: Story = { args: { isLoading: true } }
export const NoPrevious: Story = { args: { onPrevious: undefined } }
