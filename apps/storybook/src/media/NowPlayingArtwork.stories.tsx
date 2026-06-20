import type { Meta, StoryObj } from '@storybook/react'
import { NowPlayingArtwork } from '@connor-adams/designsystem'

const meta: Meta<typeof NowPlayingArtwork> = {
  title: 'Media/NowPlayingArtwork',
  component: NowPlayingArtwork,
  args: { isPlaying: true, thumbnailUrl: null },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof NowPlayingArtwork>

export const Placeholder: Story = { args: { thumbnailUrl: null, isPlaying: true } }
export const Paused: Story = { args: { thumbnailUrl: null, isPlaying: false } }
export const WithThumbnail: Story = {
  args: { isPlaying: true, thumbnailUrl: 'https://picsum.photos/seed/cf-art/280/280' },
}
