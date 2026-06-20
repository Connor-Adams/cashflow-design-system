import * as React from 'react'
import Markdown from 'react-markdown'

export function UsageNotes({ markdown }: { markdown: string }) {
  if (!markdown.trim()) return null
  return <div style={{ lineHeight: 1.6 }}><Markdown>{markdown}</Markdown></div>
}
