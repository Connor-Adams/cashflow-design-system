import * as React from 'react'
import type { Metadata } from 'next'
import '@connor-adams/designsystem/styles.css'
import { TopBar } from '../components/TopBar'
import { Sidebar } from '../components/Sidebar'

export const metadata: Metadata = {
  title: 'Connor Adams Design System',
  description: 'A portable React component library — tokens, components, and docs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body style={{ margin: 0, background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>
        <TopBar />
        <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, padding: '32px 32px 64px' }}>{children}</main>
        </div>
      </body>
    </html>
  )
}
