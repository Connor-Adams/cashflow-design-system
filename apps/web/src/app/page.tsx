import Link from 'next/link'
import manifest from '../generated/manifest.json'

type Entry = { slug: string; name: string; category: string }
const CATEGORY_ORDER = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']

export default function Home() {
  const entries = manifest as Entry[]
  const categories = CATEGORY_ORDER.filter((c) => entries.some((e) => e.category === c))

  const stats = [
    { n: entries.length, t: 'Components' },
    { n: categories.length, t: 'Categories' },
    { n: 2, t: 'Themes' },
  ]

  return (
    <div style={{ maxWidth: 820 }}>
      <h1
        style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          backgroundImage: 'var(--gradient-hero)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 12px',
        }}
      >
        Design System
      </h1>
      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-body)', maxWidth: 560, lineHeight: 1.6, margin: '0 0 28px' }}>
        A portable React design system — {entries.length} typed components, design tokens, one import.
        Pick a component from the left to see it with its variants, props, and usage.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {stats.map((s) => (
          <div key={s.t} style={{ flex: '1 1 120px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--foreground)' }}>{s.n}</div>
            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.t}</div>
          </div>
        ))}
      </div>

      <pre style={{ background: 'var(--muted)', padding: 16, borderRadius: 'var(--radius-md)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', margin: '0 0 32px' }}>
        <code>npm i @connor-adams/designsystem</code>
      </pre>

      <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', margin: '0 0 12px' }}>
        Categories
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {categories.map((c) => {
          const first = entries.find((e) => e.category === c)!
          return (
            <Link
              key={c}
              href={`/components/${first.slug}`}
              style={{
                display: 'block',
                padding: '14px 16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{c}</div>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>
                {entries.filter((e) => e.category === c).length} components
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
