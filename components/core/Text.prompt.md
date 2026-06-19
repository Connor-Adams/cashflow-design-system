The single typography primitive — use it for every piece of text instead of bare tags so the type scale and token colors stay consistent. `variant` sets the scale step and a default tag; `as` overrides the tag.

```jsx
<Text variant="display-sm">Net worth</Text>
<Text variant="body" tone="muted">Across all accounts</Text>
<Text variant="label" tone="muted">This month</Text>
<Text variant="body" mono>−$84.20</Text>
```

Variants: `display-lg|display|display-sm`, `headline-lg|headline|headline-sm`, `body-lg|body|body-sm`, `label` (uppercase eyebrow). Props: `tone` (default/muted/primary/positive/negative), `weight`, `mono`, `align`, `truncate`.
