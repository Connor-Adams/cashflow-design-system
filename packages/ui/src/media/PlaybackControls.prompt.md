Previous / play-pause / next transport buttons.

```jsx
<PlaybackControls isPaused={false} onPlayPause={toggle} onSkip={next} onPrevious={prev} />
<PlaybackControls isPaused isLoading onPlayPause={toggle} onSkip={next} />
```

The play-pause button is primary-tinted. Omit `onPrevious` to disable the previous button. `isLoading` disables every button.
