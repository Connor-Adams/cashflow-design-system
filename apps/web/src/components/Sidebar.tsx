'use client'
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import manifest from '../generated/manifest.json'

type Entry = { slug: string; name: string; category: string }
const CATEGORY_ORDER = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']

export function Sidebar() {
  const [query, setQuery] = React.useState('')
  const pathname = usePathname()
  const entries = manifest as Entry[]

  const filtered = entries.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
  const groups = CATEGORY_ORDER
    .map((category) => ({ category, items: filtered.filter((e) => e.category === category) }))
    .filter((g) => g.items.length > 0)

  return (
    <aside
      style={{
        position: 'sticky',
        top: 64,
        alignSelf: 'flex-start',
        width: 220,
        flexShrink: 0,
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto',
        padding: '20px 16px',
        borderRight: '1px solid var(--border)',
        boxSizing: 'border-box',
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter components…"
        aria-label="Filter components"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 12px',
          marginBottom: 18,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--background)',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-body-sm)',
        }}
      />

      {groups.length === 0 && (
        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-sans)' }}>
          No components match.
        </p>
      )}

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
            {group.items.map((item) => {
              const href = `/components/${item.slug}`
              const active = pathname === href
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    style={{
                      display: 'block',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-body-sm)',
                      color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
                      background: active ? 'var(--muted)' : 'transparent',
                      boxShadow: active ? 'inset 2px 0 0 var(--primary)' : 'none',
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </aside>
  )
}
