A determinate bar for budgets, savings goals, and import progress. Use `tone` to signal state (e.g. `danger` when a category is over budget).

```jsx
<Progress value={68} label="Groceries budget" showValue />
<Progress value={104} tone="danger" label="Dining" showValue />
<Progress indeterminate label="Importing statement…" />
```

Variants: `tone="primary|success|warning|danger"`, `size="sm|default|lg"`, `indeterminate`, `label`, `showValue`.
