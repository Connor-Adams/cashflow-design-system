import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from '@connoradams/designsystem'

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: {
    page: 3,
    pageCount: 10,
    siblingCount: 1,
  },
}
export default meta

type Story = StoryObj<typeof Pagination>

export const Default: Story = {}

export const FirstPage: Story = {
  args: {
    page: 1,
    pageCount: 10,
  },
}

export const LastPage: Story = {
  args: {
    page: 10,
    pageCount: 10,
  },
}

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = React.useState(1)
    return <Pagination page={page} pageCount={15} onPageChange={setPage} siblingCount={1} />
  },
}
