import * as React from 'react'

/**
 * Statement-import drop target — dashed area accepting drag-drop or click-to-
 * browse. Presentational with light state: it shows the chosen file's name/size
 * and calls `onFile(file)` so you can parse it. Highlights while dragging.
 */
export interface ImportDropzoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  accept?: string
  onFile?: (file: File) => void
  hint?: React.ReactNode
}

export function ImportDropzone({ accept = '.csv,.ofx,.qfx', onFile, hint = 'CSV, OFX or QFX · up to 10MB', className, style, ...props }: ImportDropzoneProps): React.JSX.Element {
  const [drag, setDrag] = React.useState<boolean>(false)
  const [file, setFile] = React.useState<{ name: string; size: number } | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const take = (f: File | undefined): void => { if (!f) return; setFile({ name: f.name, size: f.size }); onFile?.(f) }
  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]) }
  const fmtSize = (b: number): string => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB'

  return (
    <div
      data-slot="import-dropzone"
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDrag(true) }}
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
      <input ref={inputRef} type="file" accept={accept} onChange={(e: React.ChangeEvent<HTMLInputElement>) => take(e.target.files?.[0])} style={{ display: 'none' }} />
      <span style={{ width: 44, height: 44, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in oklch, var(--primary) 12%, transparent)', color: 'var(--primary)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" /></svg>
      </span>
      {file ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>{file.name}</span>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{fmtSize(file.size)} · click to replace</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>
            Drop a statement, or <span style={{ color: 'var(--text-link)' }}>browse</span>
          </span>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>{hint}</span>
        </div>
      )}
    </div>
  )
}
