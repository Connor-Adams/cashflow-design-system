import * as React from 'react'

/**
 * Now-playing track title + source line, with an optional external link to the
 * source. Title and source ellipsis-truncate on overflow.
 */
export interface TrackInfoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string
  source?: string
  sourceLink?: string | null
}

const ellipsis: React.CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

export function TrackInfo({ title, source, sourceLink, className, style, ...props }: TrackInfoProps): React.JSX.Element {
  return (
    <div data-slot="track-info" className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, fontFamily: 'var(--font-sans)', ...style }} {...props}>
      <h2 title={title} style={{ margin: 0, fontSize: 'var(--text-headline)', fontWeight: 'var(--weight-bold)' as React.CSSProperties['fontWeight'], color: 'var(--foreground)', ...ellipsis }}>{title}</h2>
      {source && <p title={source} style={{ margin: 0, fontSize: 'var(--text-body-lg)', fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'], color: 'var(--muted-foreground)', ...ellipsis }}>{source}</p>}
      {sourceLink && (
        <a href={sourceLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content', marginTop: 2, padding: '6px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'], color: 'var(--primary)', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg>
          <span>Open in source</span>
        </a>
      )}
    </div>
  )
}
