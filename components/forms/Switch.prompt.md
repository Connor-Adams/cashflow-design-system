A pill toggle for on/off settings (notifications, auto-reconcile) — oxblood when on. Use over Checkbox for instant-apply settings, not form submission.

```jsx
<Switch checked={autoReconcile} onCheckedChange={setAutoReconcile} />
```

Variants: `size="sm"` for dense setting rows. `disabled`. Uncontrolled with `defaultChecked`.
