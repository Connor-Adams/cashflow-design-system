'use client'
import * as React from 'react'
import { previews } from '../previews'

export function Preview({ slug }: { slug: string }) {
  const node = previews[slug]
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32, background: 'var(--card)' }}>
      {node ?? <span style={{ color: 'var(--muted-foreground)' }}>Preview coming soon.</span>}
    </div>
  )
}
