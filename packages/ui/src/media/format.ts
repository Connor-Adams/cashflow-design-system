/**
 * Format a number of seconds as `m:ss` (e.g. 75 → "1:15"). Non-finite or
 * negative input clamps to "0:00". Internal to the media category.
 */
export function formatDuration(seconds: number): string {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
  const m = Math.floor(total / 60)
  const r = total % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}
