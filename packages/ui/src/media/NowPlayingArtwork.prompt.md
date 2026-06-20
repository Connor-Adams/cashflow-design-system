Square artwork for the now-playing surface, with a gradient placeholder and a playing equalizer.

```jsx
<NowPlayingArtwork isPlaying thumbnailUrl="https://…/cover.jpg" />
<NowPlayingArtwork isPlaying={false} thumbnailUrl={null} />
```

Falls back to a token gradient + play glyph when `thumbnailUrl` is missing or fails to load. The equalizer badge animates only while `isPlaying`.
