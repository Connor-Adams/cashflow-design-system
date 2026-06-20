One-line: Stroke glyph from the built-in registry — lucide-style, renders in `currentColor`, sized by the `size` prop.

```jsx
<Icon name="wallet" />
<Icon name="trending-up" size={28} />
<span style={{ color: 'var(--destructive)' }}><Icon name="trending-down" /></span>
<Icon name="bell" title="Notifications" />   {/* labelled, not decorative */}
```

Props: `name` (required) · `size` (px, default 20) · `strokeWidth` (default 2) · `title` (accessible label — omit for decorative icons, which are `aria-hidden`). Color is inherited via `currentColor`, so wrap in a token-colored element rather than passing a color prop. Names: money (`wallet` `credit-card` `dollar-sign` `piggy-bank` `coins` `banknote` `receipt` `landmark` `trending-up` `trending-down` `pie-chart`), categories (`shopping-cart` `home` `car` `utensils` `heart` `plane` `graduation-cap` `gift` `zap` `film` `shield` `briefcase` `repeat`), actions (`search` `plus` `minus` `check` `x` `settings` `bell` `user` `calendar` `download` `upload` `filter` `pencil` `trash` `eye`), status (`info` `alert-triangle` `check-circle`), chevrons (`chevron-up` `chevron-down` `chevron-left` `chevron-right`). The full list is exported as `iconNames`. For a one-off glyph not in the set, pass raw SVG to the component that needs it — most take a `ReactNode` icon prop.
