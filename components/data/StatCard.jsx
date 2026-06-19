import React from 'react'

/**
 * Cashflow StatCard. The KPI tile: uppercase muted label, large bold value,
 * optional hint, and a signed delta whose color is resolved by the core
 * "is this number good?" logic.
 *
 * metricKind drives the delta tone:
 *   - 'gain'    → up is good (green), down is bad (red)
 *   - 'spend'   → INVERTED: up is bad (red), down is good (green)
 *   - 'neutral' → always muted, regardless of sign
 * Pass delta as a signed string like "+12%" or "-$340".
 */
function parseSign(delta) {
  if (delta == null) return 'neutral'
  const t = String(delta).trim()
  const m = t.match(/([+\-−])\s*[^\d+\-−]*\d/)
  if (m) return m[1] === '+' ? 'positive' : 'negative'
  const n = t.match(/\d+(\.\d+)?/)
  if (!n) return 'neutral'
  const v = Number(n[0])
  if (!Number.isFinite(v) || v === 0) return 'neutral'
  return v > 0 ? 'positive' : 'negative'
}

export function resolveDeltaTone(sign, kind) {
  if (kind === 'neutral' || sign === 'neutral') return 'neutral'
  if (kind === 'spend') return sign === 'positive' ? 'negative' : 'positive'
  return sign
}

const TONE_STYLE = {
  positive: {
    background: 'color-mix(in srgb, var(--positive) 16%, transparent)',
    borderColor: 'color-mix(in srgb, var(--positive) 45%, var(--border))',
    color: 'var(--positive)',
  },
  negative: {
    background: 'color-mix(in srgb, var(--destructive) 14%, transparent)',
    borderColor: 'color-mix(in srgb, var(--destructive) 45%, var(--border))',
    color: 'var(--destructive)',
  },
  neutral: { background: 'transparent', borderColor: 'var(--border)', color: 'var(--muted-foreground)' },
}

const ARROW = { positive: '▲', negative: '▼', neutral: '—' }

export function StatCard({ label, value, hint, delta, metricKind = 'gain', className, style, ...props }) {
  const sign = parseSign(delta)
  const tone = resolveDeltaTone(sign, metricKind)
  return (
    <div
      data-slot="stat-card"
      className={className}
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        boxShadow: 'var(--shadow)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...props}
    >
      <p style={{ margin: 0, fontSize: 'var(--text-label)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--muted-foreground)' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '1.55rem', fontWeight: 'var(--weight-bold)', letterSpacing: '-0.01em', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>{value}</p>
      {hint && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', lineHeight: 1.4, color: 'var(--muted-foreground)' }}>{hint}</p>}
      {delta != null && (
        <p style={{ margin: 0 }}>
          <span
            data-slot="stat-card-delta"
            data-tone={tone}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              padding: '2px 6px',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-semibold)',
              ...TONE_STYLE[tone],
            }}
          >
            <span aria-hidden="true">{ARROW[sign]}</span>
            {delta}
          </span>
        </p>
      )}
    </div>
  )
}
