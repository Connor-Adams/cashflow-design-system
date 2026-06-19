A disclosure stack for FAQs, settings groups, and statement breakdowns.

```jsx
<Accordion
  type="single"
  defaultValue="fees"
  items={[
    { value: 'fees', title: 'How are fees categorised?', content: 'Bank fees map to the Fees category automatically.' },
    { value: 'sync', title: 'How often does it sync?', content: 'Connected accounts refresh every 6 hours.' },
  ]}
/>
```

Variants: `type="single" | "multiple"`, `collapsible`, `defaultValue`.
