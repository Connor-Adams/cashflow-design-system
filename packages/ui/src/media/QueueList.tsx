import * as React from 'react'
import type { MediaTrack } from './types'
import { formatDuration } from './format'
import { Card, CardHeader, CardTitle, CardContent } from '../core/Card'
import { Badge } from '../core/Badge'
import { Button } from '../core/Button'
import { EmptyState } from '../feedback/EmptyState'
import './QueueList.css'

/**
 * Presentational queue of upcoming tracks with a count badge, optional Clear
 * action, and per-row remove. Pure display — no fetching or mutation; the
 * caller wires `onRemove`/`onClear` to its own state. Row + remove-button
 * interactive states (hover, focus-visible ring) live in `QueueList.css`.
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
    <li className="ca-queue-list__row">
      <span className="ca-queue-list__index">{index + 1}</span>
      <div className="ca-queue-list__main">
        <div className="ca-queue-list__track-title" title={track.title}>{track.title}</div>
        {track.source && <div className="ca-queue-list__track-source">{track.source}</div>}
      </div>
      {track.duration != null && <span className="ca-queue-list__duration">{formatDuration(track.duration)}</span>}
      {onRemove && (
        <button type="button" className="ca-queue-list__remove" aria-label={`Remove ${track.title}`} onClick={() => onRemove(index)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      )}
    </li>
  )
}

export const QueueList = React.forwardRef<HTMLDivElement, QueueListProps>(function QueueList(
  { items, nowPlaying, onRemove, onClear, emptyLabel = 'Queue is empty', className, ...props },
  ref,
): React.JSX.Element {
  const hasItems = items.length > 0
  return (
    <Card
      ref={ref}
      data-slot="queue-list"
      className={className ? `ca-queue-list ${className}` : 'ca-queue-list'}
      {...props}
    >
      <CardHeader>
        <div className="ca-queue-list__header">
          <div className="ca-queue-list__title-group">
            <CardTitle>Queue</CardTitle>
            <Badge>{items.length}</Badge>
          </div>
          {hasItems && onClear && <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>}
        </div>
      </CardHeader>
      <CardContent>
        {nowPlaying && (
          <div className="ca-queue-list__now-playing">
            <div style={{ minWidth: 0 }}>
              <div className="ca-queue-list__now-playing-label">Now playing</div>
              <div className="ca-queue-list__track-title" title={nowPlaying.title}>{nowPlaying.title}</div>
            </div>
            {nowPlaying.duration != null && <span className="ca-queue-list__duration">{formatDuration(nowPlaying.duration)}</span>}
          </div>
        )}
        {hasItems ? (
          <ul className="ca-queue-list__items">
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
})
