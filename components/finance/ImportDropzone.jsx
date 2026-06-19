import React from 'react'

/**
 * Cashflow ImportDropzone. The CSV/OFX statement-import target: a dashed drop
 * area that accepts drag-and-drop or click-to-browse. Presentational + light
 * state — it surfaces the chosen file's name/size via `onFile`; you handle the
 * actual parse. Shows an active state while dragging.
 */
export function ImportDropzone({ accept = '.csv,.ofx,.qfx', onFile, hint = 'CSV, OFX or QFX · up to 10MB', className, style, ...props }) {
  const [drag, setDrag] = React.useState(false)
  const [file, setFile] = React.useState(null)
  const inputRef = React.useRef(null)

  const take = (f) => { if (!f) return; setFile({ name: f.name, size: f.size }); onFile?.(f) }
  const onDrop = (e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]) }
  const fmtSize = (b) => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB'

  return (
    <div
      data-slot="import-dropzone"
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={className}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center',
        padding: '28px 24px', borderRadius: 'var(--radius-xl)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        border: `1.5px dashed ${drag ? 'var(--ring)' : 'var(--input)'}`,
        background: drag ? 'color-mix(in oklch, var(--ring) 8%, var(--card))' : 'var(--card)',
        color: 'var(--foreground)', transition: 'border-color 150ms, background-color 150ms', ...style,
      }}
      {...props}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={(e) => take(e.target.files?.[0])} style={{ display: 'none' }} />
      <span style={{ width: 44, height: 44, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in oklch, var(--primary) 12%, transparent)', color: 'var(--primary)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" /></svg>
      </span>
      {file ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)' }}>{file.name}</span>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{fmtSize(file.size)} · click to replace</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)' }}>
            Drop a statement, or <span style={{ color: 'var(--text-link)' }}>browse</span>
          </span>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>{hint}</span>
        </div>
      )}
    </div>
  )
}
