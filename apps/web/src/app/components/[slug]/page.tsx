import * as React from 'react'
import { notFound } from 'next/navigation'
import manifest from '../../../generated/manifest.json'
import propsData from '../../../generated/props.json'
import usageData from '../../../generated/usage.json'
import { Preview } from '../../../components/Preview'
import { PropsTable, type PropRow } from '../../../components/PropsTable'
import { UsageNotes } from '../../../components/UsageNotes'

export function generateStaticParams() {
  return (manifest as Array<{ slug: string }>).map((m) => ({ slug: m.slug }))
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = (manifest as Array<{ slug: string; name: string; category: string }>).find((m) => m.slug === slug)
  if (!entry) notFound()
  const rows = ((propsData as Record<string, PropRow[]>)[entry.name]) ?? []
  const usage = (usageData as Record<string, string>)[slug] ?? ''

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px' }}>
      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-body-sm)', textTransform: 'uppercase', letterSpacing: 1 }}>{entry.category}</p>
      <h1 style={{ marginTop: 4 }}>{entry.name}</h1>

      <section style={{ marginTop: 24 }}>
        <Preview slug={slug} />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Import</h2>
        <pre style={{ background: 'var(--muted)', padding: 16, borderRadius: 'var(--radius-md)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)' }}>
          <code>{`import { ${entry.name} } from '@connoradams/designsystem'`}</code>
        </pre>
      </section>

      {usage.trim() && (
        <section style={{ marginTop: 40 }}>
          <h2>Usage</h2>
          <UsageNotes markdown={usage} />
        </section>
      )}

      <section style={{ marginTop: 40 }}>
        <h2>Props</h2>
        <PropsTable rows={rows} />
      </section>
    </main>
  )
}
