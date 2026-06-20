import * as React from 'react'
import './ImportDropzone.css'

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

export const ImportDropzone = React.forwardRef<HTMLDivElement, ImportDropzoneProps>(function ImportDropzone(
  { accept = '.csv,.ofx,.qfx', onFile, hint = 'CSV, OFX or QFX · up to 10MB', className, style, ...props },
  ref,
): React.JSX.Element {
  const [drag, setDrag] = React.useState<boolean>(false)
  const [file, setFile] = React.useState<{ name: string; size: number } | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const take = (f: File | undefined): void => { if (!f) return; setFile({ name: f.name, size: f.size }); onFile?.(f) }
  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]) }
  const fmtSize = (b: number): string => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB'

  return (
    <div
      ref={ref}
      data-slot="import-dropzone"
      data-drag={drag ? 'true' : undefined}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={className ? `ca-import-dropzone ${className}` : 'ca-import-dropzone'}
      style={style}
      {...props}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={(e: React.ChangeEvent<HTMLInputElement>) => take(e.target.files?.[0])} style={{ display: 'none' }} />
      <span className="ca-import-dropzone-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" /></svg>
      </span>
      {file ? (
        <div className="ca-import-dropzone-body">
          <span className="ca-import-dropzone-title">{file.name}</span>
          <span className="ca-import-dropzone-sub ca-import-dropzone-sub--mono">{fmtSize(file.size)} · click to replace</span>
        </div>
      ) : (
        <div className="ca-import-dropzone-prompt">
          <span className="ca-import-dropzone-title">
            Drop a statement, or <span className="ca-import-dropzone-browse">browse</span>
          </span>
          <span className="ca-import-dropzone-sub">{hint}</span>
        </div>
      )}
    </div>
  )
})
