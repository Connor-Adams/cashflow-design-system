One-line: The default raised surface — white card, hairline border, light shadow, rounded-lg. Everything sits in one.

```jsx
<Card>
  <CardHeader>
    <CardTitle>Net worth</CardTitle>
    <CardDescription>Across all accounts</CardDescription>
  </CardHeader>
  <CardContent>$128,400</CardContent>
</Card>
```

Sub-parts: `CardHeader` (grid, gap) · `CardTitle` (semibold, tight tracking) · `CardDescription` (muted body) · `CardContent`. Keep elevation light — a single soft `--shadow`, never stacked shadows.
