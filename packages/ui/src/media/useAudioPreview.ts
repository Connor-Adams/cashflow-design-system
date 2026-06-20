import { useState, useRef, useCallback, useEffect } from 'react'

const PREVIEW_VOLUME = 0.5

/**
 * Preview a one-off audio URL via a single `HTMLAudioElement`. Calling
 * `playPreview` with the currently-playing `soundName` toggles it off; a
 * different name swaps the source. Cleans up on unmount. Browser-only (uses
 * `window.Audio`).
 */
export function useAudioPreview(): {
  previewingSound: string | null
  playPreview: (soundName: string, url: string) => void
  stopPreview: () => void
} {
  const [previewingSound, setPreviewingSound] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopPreview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current = null
    }
    setPreviewingSound(null)
  }, [])

  const playPreview = useCallback(
    (soundName: string, url: string) => {
      if (previewingSound === soundName) {
        stopPreview()
        return
      }
      stopPreview()
      const audio = new Audio(url)
      audio.volume = PREVIEW_VOLUME
      audioRef.current = audio
      setPreviewingSound(soundName)
      audio.play().catch(() => stopPreview())
      audio.onended = stopPreview
      audio.onerror = () => stopPreview()
    },
    [previewingSound, stopPreview],
  )

  useEffect(() => stopPreview, [stopPreview])

  return { previewingSound, playPreview, stopPreview }
}
