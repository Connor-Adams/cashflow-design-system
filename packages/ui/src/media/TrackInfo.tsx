import * as React from 'react'
import './TrackInfo.css'

/**
 * Now-playing track title + source line, with an optional external link to the
 * source. Title and source ellipsis-truncate on overflow. Interactive states
 * (the source-link hover + focus-visible ring) live in `TrackInfo.css`, not JS.
 */
export interface TrackInfoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string
  source?: string
  sourceLink?: string | null
}

export const TrackInfo = React.forwardRef<HTMLDivElement, TrackInfoProps>(function TrackInfo(
  { title, source, sourceLink, className, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="track-info"
      className={className ? `ca-track-info ${className}` : 'ca-track-info'}
      {...props}
    >
      <h2 className="ca-track-info__title" title={title}>
        {title}
      </h2>
      {source && (
        <p className="ca-track-info__source" title={source}>
          {source}
        </p>
      )}
      {sourceLink && (
        <a className="ca-track-info__link" href={sourceLink} target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg>
          <span>Open in source</span>
        </a>
      )}
    </div>
  )
})
