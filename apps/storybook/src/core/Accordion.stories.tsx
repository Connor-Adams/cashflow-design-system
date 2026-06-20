import type { Meta, StoryObj } from '@storybook/react'
import { Accordion } from '@connor-adams/designsystem'

const items = [
  { value: 'billing', title: 'Billing & Payments', content: 'Manage your payment methods, view past invoices, and update billing information.' },
  { value: 'security', title: 'Security Settings', content: 'Configure two-factor authentication, review active sessions, and set password policies.' },
  { value: 'notifications', title: 'Notifications', content: 'Choose which events trigger email or push notifications for your account.' },
]

const meta: Meta<typeof Accordion> = {
  title: 'Core/Accordion',
  component: Accordion,
  args: {
    items,
    type: 'single',
    collapsible: true,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Accordion>

export const Default: Story = {}
export const OpenByDefault: Story = { args: { defaultValue: 'billing' } }
export const Multiple: Story = { args: { type: 'multiple', defaultValue: ['billing', 'security'] } }
