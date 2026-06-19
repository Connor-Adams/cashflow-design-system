import React from 'react'

/** Cashflow Textarea — same treatment as Input, min-height 64px, top padding. */
export function Textarea({ className, style, invalid, ...props }) {
  const [focus, setFocus] = React.useState(false)
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={invalid || undefined}
      className={className}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e) }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e) }}
      style={{
        minHeight: 64,
        width: '100%',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${invalid ? 'var(--destructive)' : focus ? 'var(--ring)' : 'var(--input)'}`,
        background: 'color-mix(in oklch, var(--background) 70%, transparent)',
        padding: '8px 12px',
        fontSize: 'var(--text-body)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--foreground)',
        outline: 'none',
        resize: 'vertical',
        boxShadow: focus ? `0 0 0 3px color-mix(in oklch, var(--ring) 35%, transparent)` : 'var(--shadow)',
        transition: 'border-color 150ms, box-shadow 150ms',
        ...style,
      }}
      {...props}
    />
  )
}
