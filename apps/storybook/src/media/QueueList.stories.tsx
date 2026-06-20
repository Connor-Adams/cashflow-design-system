import type { Meta, StoryObj } from '@storybook/react'
import { QueueList } from '@connor-adams/designsystem'

const items = [
  { id: '1', title: 'Resonance', source: 'YouTube', duration: 211 },
  { id: '2', title: 'Strobe', source: 'SoundCloud', duration: 634 },
  { id: '3', title: 'Nightcall', source: 'Spotify', duration: 258 },
]
const meta: Meta<typeof QueueList> = {
  title: 'Media/QueueList',
  component: QueueList,
  args: { items, nowPlaying: { id: '0', title: 'Midnight City', source: 'YouTube', duration: 244 }, onRemove: (i: number) => console.log('remove', i), onClear: () => console.log('clear') },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof QueueList>

export const Default: Story = {}
export const Empty: Story = { args: { items: [], nowPlaying: null } }
export const NoActions: Story = { args: { onRemove: undefined, onClear: undefined } }
