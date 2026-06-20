Composed now-playing player — artwork, track info, seekable scrubber, transport — in a card. Fully controlled.

```jsx
<MediaPlayer
  track={{ title: 'Midnight City', source: 'YouTube', sourceLink: url, thumbnailUrl: cover, duration: 244 }}
  currentTime={96} duration={244} isPaused={false}
  onPlayPause={toggle} onSkip={next} onSeek={seek} autoTick
/>
```

Pass `autoTick` to advance the displayed position locally between parent updates. Omit `onSeek` for a read-only scrubber.
