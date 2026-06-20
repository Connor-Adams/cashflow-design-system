A row/overflow action menu (the ⋯ on a transaction, account, or report). Use `danger` for delete and a `separator` to group destructive actions.

```jsx
<DropdownMenu
  align="end"
  trigger={<Button variant="ghost" size="sm">⋯</Button>}
  items={[
    { label: 'Edit category', onSelect: edit },
    { label: 'Mark reconciled', onSelect: reconcile },
    { separator: true },
    { label: 'Delete', danger: true, onSelect: remove },
  ]}
/>
```

Items accept `icon`, `shortcut`, `disabled`.
