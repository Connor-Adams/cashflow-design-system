Presentational queue of upcoming tracks with a count badge, Clear action, and per-row remove.

```jsx
<QueueList
  items={queue}
  nowPlaying={current}
  onRemove={(i) => removeAt(i)}
  onClear={() => clearQueue()}
/>
```

Pure display — wire `onRemove`/`onClear` to your own state. Shows an empty state when `items` is empty. Built on `Card`, `Badge`, `Button`, and `EmptyState`.
