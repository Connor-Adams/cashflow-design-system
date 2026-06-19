A searchable single-select for long option lists (assign a category, pick a payee, choose an account). For a handful of fixed options use NativeSelect.

```jsx
<Combobox
  options={[
    { value: 'groceries', label: 'Groceries' },
    { value: 'dining', label: 'Dining' },
    { value: 'transport', label: 'Transport' },
  ]}
  defaultValue="groceries"
  placeholder="Assign category…"
  onValueChange={setCategory}
/>
```

Variants: `size="sm|default"`, `placeholder`, `emptyText`. Options accept a `hint` for a right-aligned note.
