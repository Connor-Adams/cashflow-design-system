import React from 'react'

/**
 * Cashflow text Input. 36px tall, rounded-md, --input border on a translucent
 * --background fill, with an oxblood focus ring. Set `aria-invalid` for the
 * destructive error treatment.
 */
export function Input({ className, style, invalid, ...props }) {
  const [focus, setFocus] = React.useState(false)
  return (
    <input
      data-slot="input"
      aria-invalid={invalid || undefined}
      className={className}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e) }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e) }}
      style={{
        height: 36,
        width: '100%',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${invalid ? 'var(--destructive)' : focus ? 'var(--ring)' : 'var(--input)'}`,
        background: 'color-mix(in oklch, var(--background) 70%, transparent)',
        padding: '0 12px',
        fontSize: 'var(--text-body)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--foreground)',
        outline: 'none',
        boxShadow: focus
          ? `0 0 0 3px color-mix(in oklch, var(--ring) 35%, transparent)`
          : 'var(--shadow)',
        transition: 'border-color 150ms, box-shadow 150ms',
        ...style,
      }}
      {...props}
    />
  )
}
