import type { Meta, StoryObj } from '@storybook/react'
import { ImportDropzone } from '@connoradams/designsystem'

const meta: Meta<typeof ImportDropzone> = {
  title: 'Finance/ImportDropzone',
  component: ImportDropzone,
  args: {
    accept: '.csv,.ofx,.qfx',
    hint: 'CSV, OFX or QFX · up to 10MB',
  },
}
export default meta

type Story = StoryObj<typeof ImportDropzone>

export const Default: Story = {}

export const CustomHint: Story = {
  args: {
    hint: 'Export from your bank and drop it here',
  },
}
