A transient confirmation that floats bottom-right (transaction saved, statement imported, sync failed). Auto-dismiss after a few seconds; keep copy to one line.

```jsx
<Toast variant="success" title="Statement imported" onClose={dismiss}>
  312 transactions added from Amex Cobalt.
</Toast>
```

Variants: `default | success | error | warning | info`. Optional `action` node under the body. Presentational — drive visibility and stacking from your own state.
