A currency amount field for adding/editing transactions and setting budgets. Pass `direction` + `onDirectionChange` to show the in/out toggle.

```jsx
const [amt, setAmt] = React.useState(84.2)
const [dir, setDir] = React.useState('out')
<MoneyInput value={amt} onValueChange={setAmt} direction={dir} onDirectionChange={setDir} currency="CAD" />
```

Props: `currency`, `locale`, `direction`/`onDirectionChange` (toggle), `size="sm|default"`, `invalid`, `disabled`. For display-only amounts use AmountText.
