One-line: Cashflow's three first-class data-view states — Alert (inline message), EmptyState (empty placeholder), Skeleton (loading shimmer).

```jsx
<Alert variant="error" title="Import failed">Check the CSV header row.</Alert>
<Alert variant="success">3 transactions reconciled.</Alert>

<EmptyState
  title="No transactions yet"
  description="Upload a CSV or PDF statement to get started."
  actions={<Button size="sm">Import</Button>}
/>

<Skeleton h={20} w="60%" />
<SkeletonText lines={4} />
```

Always provide loading (Skeleton), empty (EmptyState), and error (Alert) states for any data view — they are part of the design, not an afterthought. Alert variants: `error` · `warning` · `info` · `success`.
