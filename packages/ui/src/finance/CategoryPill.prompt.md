The category chip for transaction rows, filters, and budgets — icon + label with a per-category tint, drawn from a built-in icon set.

```jsx
<CategoryPill category="Groceries" />
<CategoryPill category="Eating Out" />
<CategoryPill category="Spotify" interactive onClick={filterByCategory} />
<CategoryPill category="Pet care" color="var(--chart-steel)" />
```

The icon and tint are inferred from the category/merchant text by keyword (`categoryVisual` / `categoryIconName`), so free-text names like "Eating Out", "cc fees", "Vape", or "Office Equipment" each get a sensible glyph instead of a generic default. Brand names ("Amazon", "Sephora", "Apple") resolve ahead of generic words. Override with `icon` / `color`. `size="sm|default"`, `interactive`.
