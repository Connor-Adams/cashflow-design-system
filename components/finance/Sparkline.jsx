import React from 'react'

/**
 * Cashflow Sparkline. A tiny inline trend line for StatCards, account rows, and
 * balances. Pass `data` (numbers); the line auto-scales to its box. Tone is
 * inferred from the trend (last vs first) unless you pass `tone`. Optional
 * `area` fill and an end-point `dot`.
 */
const TONES = {
  positive: 'var(--positive)',
  negative: 'var(--negative)',
  neutral: 'var(--muted-foreground)',
  primary: 'var(--primary)',
}

export function Sparkline({ data = [], width = 96, height = 28, tone, area = true, dot = true, strokeWidth = 2, className, style, ...props }) {
  const pts = data.filter((n) => typeof n === 'number' && !Number.isNaN(n))
  if (pts.length < 2) {
    return <span data-slot="sparkline" className={className} style={{ display: 'inline-block', width, height, ...style }} {...props} />
  }

  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const span = max - min || 1
  const pad = strokeWidth + 1
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  const coords = pts.map((v, i) => {
    const x = pad + (i / (pts.length - 1)) * innerW
    const y = pad + (1 - (v - min) / span) * innerH
    return [x, y]
  })

  const dir = pts[pts.length - 1] >= pts[0] ? 'positive' : 'negative'
  const color = TONES[tone || dir] || TONES.neutral
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const fill = `${line} L${coords[coords.length - 1][0].toFixed(1)} ${height} L${coords[0][0].toFixed(1)} ${height} Z`
  const gid = React.useId ? React.useId().replace(/:/g, '') : 'sp' + Math.random().toString(36).slice(2, 7)
  const [ex, ey] = coords[coords.length - 1]

  return (
    <svg
      data-slot="sparkline"
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible', ...style }}
      {...props}
    >
      {area && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.22" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fill} fill={`url(#${gid})`} />
        </>
      )}
      <path d={line} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {dot && <circle cx={ex} cy={ey} r={strokeWidth + 0.5} fill={color} />}
    </svg>
  )
}
