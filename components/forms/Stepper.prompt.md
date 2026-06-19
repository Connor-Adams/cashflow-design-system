A compact numeric input for small bounded quantities (split count, reminder days, statement months back).

```jsx
<Stepper defaultValue={3} min={1} max={12} format={(v) => `${v} mo`} onValueChange={setMonths} />
```

Variants: `min`/`max`/`step`, `size="sm|default"`, `format`, `disabled`. For wide ranges use Slider; for free numeric entry use Input.
