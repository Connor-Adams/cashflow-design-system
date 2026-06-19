A modal for confirmations and short forms (delete transaction, edit category, add account). Keep the footer to one primary + one secondary Button.

```jsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete transaction?"
  description="This removes it from all reports. You can't undo this."
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive" onClick={confirm}>Delete</Button>
  </>}
/>
```

Variants: `size="sm" | "default" | "lg"`. Closes on scrim click and Escape.
