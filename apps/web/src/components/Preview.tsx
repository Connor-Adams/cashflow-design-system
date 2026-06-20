'use client'
import * as React from 'react'
import { previews } from '../previews'

export function Preview({ slug }: { slug: string }) {
  const variants = previews[slug]

  if (!variants || variants.length === 0) {
    return (
      <div
        style={{
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 24,
          color: 'var(--muted-foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-body-sm)',
        }}
      >
        No live preview yet for this component.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {variants.map((v) => (
        <div key={v.label}>
          <p
            style={{
              margin: '0 0 8px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--primary)',
            }}
          >
            {v.label}
          </p>
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              background: 'var(--card, var(--background))',
            }}
          >
            {v.node}
          </div>
        </div>
      ))}
    </div>
  )
}
