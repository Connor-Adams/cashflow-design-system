import type { Meta, StoryObj } from '@storybook/react'
import { MoneyInput } from '@connoradams/designsystem'

const meta: Meta<typeof MoneyInput> = {
  title: 'Finance/MoneyInput',
  component: MoneyInput,
  args: {
    currency: 'CAD',
    locale: 'en-CA',
    placeholder: '0.00',
    size: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default'],
    },
    direction: {
      control: 'select',
      options: ['in', 'out', undefined],
    },
  },
}
export default meta

type Story = StoryObj<typeof MoneyInput>

export const Default: Story = {}

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 1250,
  },
}

export const WithDirectionToggle: Story = {
  args: {
    defaultValue: 94.32,
    direction: 'out',
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: 500,
    disabled: true,
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    defaultValue: 75,
  },
}
