'use client'
import * as React from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'ds-theme'

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* localStorage unavailable (private mode) — toggle still works for the session */
  }
}

export function ThemeToggle() {
  // Server render is theme-agnostic; resolve the real theme after mount to avoid
  // a hydration mismatch. The inline script in layout.tsx prevents a flash.
  const [theme, setTheme] = React.useState<Theme | null>(null)

  React.useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as Theme) ?? 'light'
    setTheme(current)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        padding: 0,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--muted-foreground)',
        cursor: 'pointer',
        lineHeight: 0,
      }}
    >
      {/* Render nothing meaningful until mounted to keep server/client markup identical */}
      {theme === null ? null : isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
