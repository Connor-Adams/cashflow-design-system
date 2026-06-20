import * as React from 'react'
import type { MediaTrack } from './types'
import { formatDuration } from './format'
import { Card, CardHeader, CardTitle, CardContent } from '../core/Card'
import { Badge } from '../core/Badge'
import { Button } from '../core/Button'
import { EmptyState } from '../feedback/EmptyState'

/**
 * Presentational queue of upcoming tracks with a count badge, optional Clear
 * action, and per-row remove. Pure display — no fetching or mutation; the
 * caller wires `onRemove`/`onClear` to its own state.
 */
export interface QueueListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  items: MediaTrack[]
  nowPlaying?: MediaTrack | null
  onRemove?: (index: number) => void
  onClear?: () => void
  emptyLabel?: string
}

function QueueRow({ track, index, onRemove }: { track: MediaTrack; index: number; onRemove?: (index: number) => void }): React.JSX.Element {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px', listStyle: 'none', borderRadius: 'var(--radius-md)' }}>
      <span style={{ width: 20, textAlign: 'right', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', flex: 'none' }}>{index + 1}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div title={track.title} style={{ fontSize: 'var(--text-body)', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
        {track.source && <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>{track.source}</div>}
      </div>
      {track.duration != null && <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', flex: 'none' }}>{formatDuration(track.duration)}</span>}
      {onRemove && (
        <button type="button" aria-label={`Remove ${track.title}`} onClick={() => onRemove(index)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: 'none', background: 'transparent', color: 'var(--muted-foreground)', cursor: 'pointer', borderRadius: 'var(--radius-full)', flex: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      )}
    </li>
  )
}

export function QueueList({ items, nowPlaying, onRemove, onClear, emptyLabel = 'Queue is empty', className, style, ...props }: QueueListProps): React.JSX.Element {
  const hasItems = items.length > 0
  return (
    <Card data-slot="queue-list" className={className} style={style} {...props}>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CardTitle>Queue</CardTitle>
            <Badge>{items.length}</Badge>
          </div>
          {hasItems && onClear && <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>}
        </div>
      </CardHeader>
      <CardContent>
        {nowPlaying && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 4px', marginBottom: 8, borderBottom: '1px solid var(--border)' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--primary)', fontWeight: 'var(--weight-semibold)' }}>Now playing</div>
              <div title={nowPlaying.title} style={{ fontSize: 'var(--text-body)', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nowPlaying.title}</div>
            </div>
            {nowPlaying.duration != null && <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{formatDuration(nowPlaying.duration)}</span>}
          </div>
        )}
        {hasItems ? (
          <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((track, index) => (
              <QueueRow key={track.id ?? index} track={track} index={index} onRemove={onRemove} />
            ))}
          </ul>
        ) : (
          <EmptyState title={emptyLabel} description="Add tracks to start playing." />
        )}
      </CardContent>
    </Card>
  )
}
