import * as React from 'react'
import Link from 'next/link'
import manifest from '../../generated/manifest.json'

type ManifestEntry = { slug: string; name: string; category: string }

const CATEGORY_ORDER = [
  'core',
  'data',
  'feedback',
  'finance',
  'forms',
  'navigation',
  'overlays',
] as const

function groupByCategory(entries: ManifestEntry[]): Map<string, ManifestEntry[]> {
  const map = new Map<string, ManifestEntry[]>(CATEGORY_ORDER.map((c) => [c, []]))
  for (const entry of entries) {
    const bucket = map.get(entry.category)
    if (bucket) {
      bucket.push(entry)
    }
  }
  return map
}

export default function ComponentsIndexPage() {
  const entries = manifest as ManifestEntry[]
  const grouped = groupByCategory(entries)

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
      <h1
        style={{
          margin: '0 0 8px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--foreground)',
        }}
      >
        Components
      </h1>
      <p
        style={{
          margin: '0 0 48px',
          color: 'var(--muted-foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-body-sm)',
        }}
      >
        {entries.length} components across {CATEGORY_ORDER.length} categories
      </p>

      {CATEGORY_ORDER.map((category) => {
        const items = grouped.get(category) ?? []
        if (items.length === 0) return null
        const heading = category.charAt(0).toUpperCase() + category.slice(1)

        return (
          <section key={category} style={{ marginBottom: 48 }}>
            <h2
              style={{
                margin: '0 0 16px',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--muted-foreground)',
              }}
            >
              {heading}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 12,
              }}
            >
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/components/${item.slug}`}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
