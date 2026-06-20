A tiny trend line to sit beside a balance or inside a StatCard — green when the series rises, oxblood when it falls.

```jsx
<Sparkline data={[120, 138, 132, 150, 162, 158, 175]} />
<Sparkline data={[90, 84, 72, 68, 60]} width={120} height={32} />
<Sparkline data={series} tone="primary" area={false} />
```

Props: `width`, `height`, `tone` (override inferred), `area`, `dot`, `strokeWidth`.
