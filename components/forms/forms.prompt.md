One-line: Cashflow form controls — Input, Textarea, NativeSelect, and a Label that sits above its field.

```jsx
<Label>
  Merchant
  <Input placeholder="Whole Foods" />
</Label>

<Label>
  Currency
  <NativeSelect options={['CAD', 'USD', 'EUR']} />
</Label>

<Input invalid defaultValue="bad@" />
```

All fields: 36px tall, `--input` border, oxblood 3px focus ring, translucent fill. Labels are semibold muted captions stacked above the control. Set `invalid` for the destructive red border + ring.
