import * as React from 'react'
import Link from 'next/link'
import { Showcase } from '../components/Showcase'

export default function Home() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)' }}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '80px 24px 72px',
          textAlign: 'center',
          background: 'var(--background)',
        }}
      >
        {/* Gradient orb — the brand moment */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 560,
            height: 320,
            background: 'var(--gradient-hero)',
            opacity: 0.12,
            borderRadius: '50%',
            filter: 'blur(72px)',
            pointerEvents: 'none',
          }}
        />

        {/* Wordmark */}
        <p
          style={{
            margin: '0 0 20px',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          }}
        >
          Connor Adams
        </p>

        {/* Gradient headline */}
        <h1
          style={{
            margin: '0 0 20px',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            backgroundImage: 'var(--gradient-hero)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Design System
        </h1>

        {/* Tagline */}
        <p
          style={{
            margin: '0 auto 36px',
            maxWidth: 520,
            fontSize: 'var(--text-body)',
            color: 'var(--muted-foreground)',
            lineHeight: 1.65,
          }}
        >
          A portable React design system — 43 typed components, design tokens, one import.{' '}
          <code
            style={{
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1px 6px',
              fontSize: '0.875em',
              fontFamily: 'var(--font-mono)',
              color: 'var(--foreground)',
            }}
          >
            @connor-adams/designsystem
          </code>
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
          }}
        >
          <Link
            href="/components"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 22px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              textDecoration: 'none',
              lineHeight: 1,
              transition: 'background 0.15s',
            }}
          >
            Browse components
          </Link>

          <a
            href="https://github.com/Connor-Adams/cashflow-design-system"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 22px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              textDecoration: 'none',
              lineHeight: 1,
            }}
          >
            GitHub
          </a>

          <a
            href="https://cashflow-storybook.vercel.app"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 22px',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--muted-foreground)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              textDecoration: 'none',
              lineHeight: 1,
            }}
          >
            Storybook
          </a>
        </div>
      </section>

      {/* ── Gradient accent bar ───────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          height: 3,
          background: 'var(--gradient-hero)',
          opacity: 0.7,
        }}
      />

      {/* ── Showcase strip ────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '56px 24px 64px',
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          }}
        >
          Live components
        </p>
        <h2
          style={{
            margin: '0 0 32px',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
          }}
        >
          Everything renders exactly as it ships.
        </h2>

        <Showcase />

        <p
          style={{
            marginTop: 32,
            fontSize: 'var(--text-body-sm)',
            color: 'var(--muted-foreground)',
          }}
        >
          All 43 components live in{' '}
          <Link
            href="/components"
            style={{
              color: 'var(--primary)',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              fontWeight: 500,
            }}
          >
            the components index
          </Link>
          . Explore variant playgrounds in{' '}
          <a
            href="https://cashflow-storybook.vercel.app"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--primary)',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              fontWeight: 500,
            }}
          >
            Storybook
          </a>
          .
        </p>
      </section>
    </main>
  )
}
