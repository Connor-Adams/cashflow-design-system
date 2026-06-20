import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@connoradams/designsystem'

const meta: Meta<typeof Card> = {
  title: 'Core/Card',
  component: Card,
  args: {},
}
export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
        <CardDescription>Your spending overview for June 2025.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-body)' }}>
          Total expenses: $3,240.00
        </p>
      </CardContent>
    </Card>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Card style={{ maxWidth: 280 }}>
      <CardContent>Simple card content.</CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Budget Alert</CardTitle>
        <CardDescription>You are approaching your dining budget.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-body)' }}>
          $420 of $500 used (84%)
        </p>
      </CardContent>
    </Card>
  ),
}
