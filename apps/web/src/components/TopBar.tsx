import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function TopBar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 22px',
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in oklch, var(--background) 90%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          color: 'var(--foreground)',
        }}
      >
        <span
          aria-hidden
          style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--gradient-hero)' }}
        />
        <strong style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)' }}>
          Connor Adams · Design System
        </strong>
      </Link>
      <span style={{ flex: 1 }} />
      <ThemeToggle />
    </header>
  )
}
