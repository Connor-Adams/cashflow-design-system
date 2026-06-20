import * as React from 'react'

export default function Home() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)', padding: '32px 0' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
        Design System
      </h1>
      <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--muted-foreground)' }}>
        Select a component from the sidebar to view its documentation.
      </p>
    </main>
  )
}
