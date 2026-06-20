import * as React from 'react'
import './Sparkline.css'

/**
 * Tiny inline trend line for KPI tiles and account rows. `data` is a series of
 * numbers, auto-scaled to the box. Tone is inferred from the trend (last vs
 * first) unless `tone` is set. Optional `area` gradient fill and end `dot`.
 */
export interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'data'> {
  data: number[]
  width?: number
  height?: number
  tone?: 'positive' | 'negative' | 'neutral' | 'primary'
  area?: boolean
  dot?: boolean
  strokeWidth?: number
}

const TONES: Record<'positive' | 'negative' | 'neutral' | 'primary', string> = {
  positive: 'var(--positive)',
  negative: 'var(--negative)',
  neutral: 'var(--muted-foreground)',
  primary: 'var(--primary)',
}

export const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  { data = [], width = 96, height = 28, tone, area = true, dot = true, strokeWidth = 2, className, style, ...props },
  ref,
): React.JSX.Element {
  const base = className ? `ca-sparkline ${className}` : 'ca-sparkline'
  const fallbackId = React.useId ? React.useId().replace(/:/g, '') : 'sp' + Math.random().toString(36).slice(2, 7)
  const pts = data.filter((n) => typeof n === 'number' && !Number.isNaN(n))
  if (pts.length < 2) {
    return (
      <svg
        ref={ref}
        data-slot="sparkline"
        className={base}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={style}
        {...props}
      />
    )
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
    return [x, y] as [number, number]
  })

  const dir: 'positive' | 'negative' = (pts[pts.length - 1] ?? 0) >= (pts[0] ?? 0) ? 'positive' : 'negative'
  const color = TONES[tone || dir] || TONES.neutral
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const lastCoord = coords[coords.length - 1]!
  const firstCoord = coords[0]!
  const fill = `${line} L${lastCoord[0].toFixed(1)} ${height} L${firstCoord[0].toFixed(1)} ${height} Z`
  const gid = fallbackId
  const [ex, ey] = lastCoord

  return (
    <svg
      ref={ref}
      data-slot="sparkline"
      className={base}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={style}
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
})
