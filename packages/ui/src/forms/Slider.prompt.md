A single-value range control for budgets, thresholds, and filters (e.g. "alert when a transaction exceeds $X").

```jsx
<Slider
  min={0} max={500} step={10}
  defaultValue={120}
  showValue
  format={(v) => `$${v}`}
  onValueChange={setThreshold}
/>
```

Variants: `min`/`max`/`step`, `showValue`, `format`, `disabled`.
