import type { Meta, StoryObj } from '@storybook/react'
import { MediaPlayer } from '@connor-adams/designsystem'

const noop = () => {}
const meta: Meta<typeof MediaPlayer> = {
  title: 'Media/MediaPlayer',
  component: MediaPlayer,
  args: {
    track: { title: 'Midnight City', source: 'YouTube', sourceLink: 'https://youtu.be/dX3k_QDnzHE', thumbnailUrl: 'https://picsum.photos/seed/cf-mp/280/280', duration: 244 },
    currentTime: 96, duration: 244, isPaused: false, isLoading: false,
    onPlayPause: noop, onSkip: noop, onPrevious: noop, onSeek: noop,
  },
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof MediaPlayer>

export const Default: Story = {}
export const Paused: Story = { args: { isPaused: true } }
export const Placeholder: Story = { args: { track: { title: 'No track playing', source: undefined, thumbnailUrl: null }, currentTime: 0, duration: 0 } }
