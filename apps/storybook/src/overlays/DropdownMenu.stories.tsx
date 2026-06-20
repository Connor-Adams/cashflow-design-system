import type { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu } from '@connoradams/designsystem'

const ITEMS_DEFAULT = [
  { label: 'Edit', shortcut: '⌘E', onSelect: () => {} },
  { label: 'Duplicate', shortcut: '⌘D', onSelect: () => {} },
  { separator: true },
  { label: 'Share', onSelect: () => {} },
  { separator: true },
  { label: 'Delete', danger: true, onSelect: () => {} },
]

const ITEMS_WITH_DISABLED = [
  { label: 'View details', onSelect: () => {} },
  { label: 'Edit', onSelect: () => {} },
  { label: 'Export', disabled: true },
  { separator: true },
  { label: 'Delete', danger: true, onSelect: () => {} },
]

const meta: Meta<typeof DropdownMenu> = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  args: {
    trigger: <button type="button" style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)', cursor: 'pointer' }}>Options ▾</button>,
    items: ITEMS_DEFAULT,
    align: 'start',
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'end'],
    },
    trigger: { control: false },
    items: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {}

export const AlignEnd: Story = {
  args: {
    align: 'end',
  },
}

export const WithDisabled: Story = {
  args: {
    items: ITEMS_WITH_DISABLED,
  },
}
