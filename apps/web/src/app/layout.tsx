import * as React from 'react'
import type { Metadata } from 'next'
import '@connoradams/designsystem/styles.css'
import { SiteHeader } from '../components/SiteHeader'

export const metadata: Metadata = {
  title: 'Connor Adams Design System',
  description: 'A portable React component library — tokens, components, and docs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
