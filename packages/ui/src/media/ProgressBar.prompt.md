Seekable playback scrubber with elapsed / total time. Click to seek.

```jsx
<ProgressBar currentTime={75} duration={214} onSeek={(s) => player.seek(s)} />
<ProgressBar currentTime={0} duration={0} />
```

`onSeek` receives whole seconds. Omit it (or pass `duration={0}`) for a read-only bar. For a non-media determinate bar, use `Progress` instead.
