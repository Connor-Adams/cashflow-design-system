/**
 * A track in the media player. All fields beyond `title` are optional so the
 * type fits queue rows, now-playing, and previews alike. The DS never derives
 * `source`/`thumbnailUrl` — the caller supplies them.
 */
export interface MediaTrack {
  id?: string
  title: string
  source?: string
  sourceLink?: string | null
  thumbnailUrl?: string | null
  /** Track length in seconds. */
  duration?: number
}
