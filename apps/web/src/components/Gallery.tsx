'use client'

import * as React from 'react'
import Link from 'next/link'
import { previews } from '../previews'
import { GallerySidebar } from './GallerySidebar'

export type ManifestEntry = { slug: string; name: string; category: string }

const CATEGORY_ORDER = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays'] as const

const HEADER_OFFSET = 72

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function Gallery({ entries }: { entries: ManifestEntry[] }) {
  const [query, setQuery] = React.useState('')
  const q = query.trim().toLowerCase()

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: entries.filter((e) => e.category === category && e.name.toLowerCase().includes(q)),
  })).filter((group) => group.items.length > 0)

  const total = groups.reduce((n, group) => n + group.items.length, 0)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 32,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 24px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <GallerySidebar groups={groups} query={query} onQueryChange={setQuery} />

      <main style={{ flex: 1, minWidth: 0 }}>
        {total === 0 ? (
          <p style={{ color: 'var(--muted-foreground)' }}>No components match.</p>
        ) : (
          groups.map((group) => (
            <section key={group.category} style={{ marginBottom: 56 }}>
              <h2
                style={{
                  margin: '0 0 24px',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--muted-foreground)',
                }}
              >
                {cap(group.category)}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {group.items.map((item) => (
                  <article key={item.slug} id={item.slug} style={{ scrollMarginTop: HEADER_OFFSET }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 'var(--text-body)',
                          fontWeight: 600,
                          color: 'var(--foreground)',
                        }}
                      >
                        {item.name}
                      </h3>
                      <Link
                        href={`/components/${item.slug}`}
                        style={{
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          fontSize: 'var(--text-body-sm)',
                          fontWeight: 500,
                          flexShrink: 0,
                        }}
                      >
                        Details →
                      </Link>
                    </div>

                    <div
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 32,
                        background: 'var(--card)',
                      }}
                    >
                      {previews[item.slug] ?? (
                        <span style={{ color: 'var(--muted-foreground)' }}>Preview coming soon.</span>
                      )}
                    </div>

                    <pre
                      style={{
                        margin: '12px 0 0',
                        background: 'var(--muted)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        overflowX: 'auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--foreground)',
                      }}
                    >
                      <code>{`import { ${item.name} } from '@connor-adams/designsystem'`}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  )
}
