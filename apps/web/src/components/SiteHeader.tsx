import * as React from 'react'
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        borderBottom: '1px solid var(--border)',
        background: 'var(--background)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: 'var(--text-body-sm)',
          letterSpacing: '-0.01em',
        }}
      >
        Connor Adams{' '}
        <span style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>
          · Design System
        </span>
      </Link>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
          }}
        >
          Home
        </Link>
        <Link
          href="/components"
          style={{
            textDecoration: 'none',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
          }}
        >
          Components
        </Link>
        <a
          href="https://cashflow-storybook.vercel.app"
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: 'none',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
          }}
        >
          Storybook
        </a>
        <a
          href="https://github.com/Connor-Adams/cashflow-design-system"
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: 'none',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
          }}
        >
          GitHub
        </a>
      </nav>
    </header>
  )
}
