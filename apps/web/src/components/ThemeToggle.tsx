'use client'
import * as React from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark')

  React.useEffect(() => {
    const stored = (localStorage.getItem('theme') as 'light' | 'dark' | null)
    const initial = stored ?? (document.documentElement.dataset.theme as 'light' | 'dark') ?? 'dark'
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'var(--secondary, transparent)',
        color: 'var(--foreground)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-body-sm)',
        cursor: 'pointer',
      }}
    >
      {theme === 'dark' ? '◐ Light' : '◑ Dark'}
    </button>
  )
}
