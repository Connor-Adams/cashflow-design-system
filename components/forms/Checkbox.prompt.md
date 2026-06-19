A square checkbox for multi-select and form opt-ins (select transactions, terms). Use `indeterminate` on a header checkbox when some but not all rows are selected.

```jsx
<label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
  <Checkbox checked={sel} onCheckedChange={setSel} /> Business expense
</label>
```

Variants: `indeterminate`, `disabled`. Uncontrolled with `defaultChecked`.
