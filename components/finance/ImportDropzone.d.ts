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
export declare function ImportDropzone(props: ImportDropzoneProps): React.JSX.Element
