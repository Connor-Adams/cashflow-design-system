A segmented control for switching between a few mutually-exclusive views (timeframe, chart type, account filter). For navigation between content panels prefer Tabs; use this for filters and settings.

```jsx
<ToggleGroup
  type="single"
  defaultValue="month"
  items={[
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ]}
  onValueChange={setRange}
/>
```

Variants: `type="single" | "multiple"`, `size="sm | default"`, optional per-item `icon`.
