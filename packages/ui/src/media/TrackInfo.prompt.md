Now-playing title, source label, and an optional link out to the source.

```jsx
<TrackInfo title="Midnight City" source="YouTube" sourceLink="https://youtu.be/…" />
<TrackInfo title="airhorn.mp3" source="Local Sound" sourceLink={null} />
```

Title and source truncate with an ellipsis. The link renders only when `sourceLink` is set and opens in a new tab.
