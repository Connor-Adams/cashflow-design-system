A circular person avatar (account holder, shared-ledger member) with an initials fallback when the image is missing.

```jsx
<Avatar src={user.photo} name="Connor Adams" size="md" status="online" />
<Avatar name="Priya Shah" />   {/* initials only */}
```

Variants: `size="xs|sm|md|lg|xl"` or px, `status="online|away|offline"`, `ring`. For merchant/category chips use `LetterAvatar`.
