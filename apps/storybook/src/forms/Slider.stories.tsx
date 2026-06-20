import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from '@connoradams/designsystem'

const meta: Meta<typeof Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  args: {
    min: 0,
    max: 100,
    defaultValue: 40,
  },
}
export default meta

type Story = StoryObj<typeof Slider>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 70, showValue: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 30 } }
