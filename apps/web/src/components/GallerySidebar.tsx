'use client'

import * as React from 'react'

type Entry = { slug: string; name: string; category: string }
type Group = { category: string; items: Entry[] }

export function GallerySidebar({
  groups,
  query,
  onQueryChange,
}: {
  groups: Group[]
  query: string
  onQueryChange: (value: string) => void
}) {
  return (
    <aside
      style={{
        position: 'sticky',
        top: 72,
        alignSelf: 'flex-start',
        width: 220,
        flexShrink: 0,
        maxHeight: 'calc(100vh - 88px)',
        overflowY: 'auto',
      }}
    >
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Filter components…"
        aria-label="Filter components"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 12px',
          marginBottom: 20,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--background)',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-body-sm)',
        }}
      />

      {groups.map((group) => (
        <div key={group.category} style={{ marginBottom: 16 }}>
          <p
            style={{
              margin: '0 0 6px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--muted-foreground)',
            }}
          >
            {group.category.charAt(0).toUpperCase() + group.category.slice(1)}
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {group.items.map((item) => (
              <li key={item.slug}>
                <a
                  href={`#${item.slug}`}
                  style={{
                    display: 'block',
                    padding: '3px 0',
                    color: 'var(--muted-foreground)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-body-sm)',
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}
