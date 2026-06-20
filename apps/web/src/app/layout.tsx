import * as React from 'react'
import type { Metadata } from 'next'
import '@connor-adams/designsystem/styles.css'
import { SiteHeader } from '../components/SiteHeader'

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
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
