The category chip for transaction rows, filters, and budgets — icon + label with a per-category tint, drawn from a built-in icon set.

```jsx
<CategoryPill category="groceries" />
<CategoryPill category="income" />
<CategoryPill category="dining" interactive onClick={filterByDining} />
<CategoryPill category="custom" label="Pet care" color="var(--chart-steel)" />
```

Built-in categories: groceries, income, dining, transport, subscriptions, utilities, fees, housing. Override with `icon` / `color`. `size="sm|default"`, `interactive`.
