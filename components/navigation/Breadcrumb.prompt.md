A path trail for nested views (Accounts › Amex Cobalt › Statements).

```jsx
<Breadcrumb items={[
  { label: 'Accounts', href: '/accounts' },
  { label: 'Amex Cobalt', href: '/accounts/amex' },
  { label: 'March 2026' },
]} />
```

The final item is the current page — render it without `href`.
