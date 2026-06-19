A single-choice radio group for mutually-exclusive options (account type, statement period). Exported as `RadioGroup`.

```jsx
<RadioGroup
  options={['Chequing', 'Savings', 'Credit']}
  value={acctType}
  onValueChange={setAcctType}
/>
```

Variants: `orientation="horizontal"` for inline rows, `defaultValue` (uncontrolled), `disabled`. Options accept `{ value, label }` objects.
