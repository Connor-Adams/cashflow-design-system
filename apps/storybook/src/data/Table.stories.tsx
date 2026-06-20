import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@connor-adams/designsystem'

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  args: {},
}
export default meta

type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Jun 15</TableCell>
          <TableCell>Whole Foods Market</TableCell>
          <TableCell>Groceries</TableCell>
          <TableCell>−$94.32</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jun 14</TableCell>
          <TableCell>Acme Corp Payroll</TableCell>
          <TableCell>Income</TableCell>
          <TableCell>+$4,250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jun 13</TableCell>
          <TableCell>Netflix Subscription</TableCell>
          <TableCell>Subscriptions</TableCell>
          <TableCell>−$18.99</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithSelectedRow: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Jun 15</TableCell>
          <TableCell>Whole Foods Market</TableCell>
          <TableCell>−$94.32</TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell>Jun 14</TableCell>
          <TableCell>Acme Corp Payroll</TableCell>
          <TableCell>+$4,250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jun 13</TableCell>
          <TableCell>Netflix Subscription</TableCell>
          <TableCell>−$18.99</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
