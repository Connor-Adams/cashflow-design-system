import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from '@connor-adams/designsystem'

const meta: Meta<typeof ProgressBar> = {
  title: 'Media/ProgressBar',
  component: ProgressBar,
  args: { currentTime: 75, duration: 214, onSeek: (s: number) => console.log('seek', s) },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {}
export const Start: Story = { args: { currentTime: 0, duration: 214 } }
export const NoDuration: Story = { args: { currentTime: 0, duration: 0 } }
