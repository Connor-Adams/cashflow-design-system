import * as React from 'react'

export interface PropRow { name: string; type: string; required: boolean; defaultValue: string | null; description: string }

export function PropsTable({ rows }: { rows: PropRow[] }) {
  if (!rows.length) return <p style={{ color: 'var(--muted-foreground)' }}>No documented props.</p>
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
          <th style={{ padding: '8px 12px' }}>Prop</th>
          <th style={{ padding: '8px 12px' }}>Type</th>
          <th style={{ padding: '8px 12px' }}>Default</th>
          <th style={{ padding: '8px 12px' }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} style={{ borderBottom: '1px solid color-mix(in oklch, var(--border) 50%, transparent)' }}>
            <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{r.name}{r.required ? '*' : ''}</td>
            <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{r.type}</td>
            <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{r.defaultValue ?? '—'}</td>
            <td style={{ padding: '8px 12px' }}>{r.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
