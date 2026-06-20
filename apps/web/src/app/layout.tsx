import * as React from 'react'
import type { Metadata } from 'next'
import '@connor-adams/designsystem/styles.css'
import { TopBar } from '../components/TopBar'
import { Sidebar } from '../components/Sidebar'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Connor Adams Design System',
  description: 'A portable React component library — tokens, components, and docs.',
}

// Runs before first paint: applies the persisted theme so there is no flash of
// the wrong palette. Falls back to light. Kept as a string for inline injection.
const themeInit = `(function(){try{var t=localStorage.getItem('ds-theme');if(t!=='dark'&&t!=='light'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body style={{ margin: 0, background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>
        <TopBar />
        <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, padding: '32px 32px 64px' }}>{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
