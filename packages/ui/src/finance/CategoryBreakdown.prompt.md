A card that ranks money by category as horizontal bars — the "net spend by category" tile.

```jsx
<CategoryBreakdown
  title="Net spend by category"
  subtitle="This month · transfers excluded"
  trend={[12, 9, 14, 11, 18, 16, 22]}
  rows={[
    { category: 'groceries', amount: -842 },
    { category: 'dining', amount: -586 },
    { category: 'transport', amount: -418 },
  ]}
/>
<CategoryBreakdown rows={rows} onSelect={(category) => filterBy(category)} />
```

Bars scale to the largest absolute amount (override with `max`). Pass `trend` for the header sparkline (`trendTone` defaults to negative). Pass `onSelect` to make each row a button. Amounts infer in/out sign, so it works for income too.
