import type { Meta, StoryObj } from '@storybook/react'
import { TrackInfo } from '@connor-adams/designsystem'

const meta: Meta<typeof TrackInfo> = {
  title: 'Media/TrackInfo',
  component: TrackInfo,
  args: { title: 'Midnight City', source: 'YouTube', sourceLink: 'https://youtu.be/dX3k_QDnzHE' },
}
export default meta

type Story = StoryObj<typeof TrackInfo>

export const Default: Story = {}
export const NoLink: Story = { args: { title: 'Local Sound — airhorn.mp3', source: 'Local Sound', sourceLink: null } }
export const LongTitle: Story = { args: { title: 'A Very Long Track Title That Should Truncate With An Ellipsis When It Overflows', source: 'SoundCloud', sourceLink: 'https://soundcloud.com/x' } }
