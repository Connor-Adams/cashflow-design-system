'use client'
import * as React from 'react'
import { Button } from '@connoradams/designsystem'

// slug → representative live preview. One curated render per component.
// (Storybook holds the exhaustive variant matrices; this is the docs-site showcase.)
export const previews: Record<string, React.ReactNode> = {
  button: (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Add transaction</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </div>
  ),
}
