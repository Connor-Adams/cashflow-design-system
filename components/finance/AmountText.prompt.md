The money-value primitive — use it for every currency figure instead of hand-coloring spans, so the green-in / oxblood-out convention stays consistent.

```jsx
<AmountText value={4900} />            {/* +$4,900.00 in green */}
<AmountText value={-84.2} />           {/* −$84.20 in oxblood */}
<AmountText value={128400} size="xl" currency="USD" locale="en-US" />
<AmountText value={2400} colored={false} showSign={false} />
```

Props: `currency`, `locale`, `direction` (override inferred sign), `colored`, `showSign`, `decimals`, `size="sm|default|lg|xl"`, `weight`.
