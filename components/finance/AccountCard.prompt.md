A tile for a connected account in lists and the accounts grid.

```jsx
<AccountCard name="Amex Cobalt" institution="Amex" mask="3001" kind="credit" balance={-1284.5} status="synced" />
<AccountCard name="TD Chequing" institution="TD" mask="8842" kind="chequing" balance={6240.18} status="synced" onClick={open} selected />
```

`kind` tints the chip and relabels credit as "owing". `status="synced|syncing|error"`. Pass `onClick` for a selectable button.
