---
"@connor-adams/designsystem": patch
"@connor-adams/tokens": patch
---

Fix a total CSS load failure in Next.js consumers. The previous layer setup
applied cascade layers through `@import "..." layer(base|components)` in
`styles.css`. Next.js's CSS pipeline silently drops layered `@import`s, so the
whole stylesheet — tokens and components — failed to load: pages rendered
completely unstyled (serif fallback, no token variables).

Layers are now baked into the files instead: the token base element resets live
in `@layer base` (in `tokens/base.css`) and the bundled component CSS is wrapped
in `@layer components` at build time (tsup `onSuccess`). `styles.css` uses plain
`@import`, which both Next.js and Vite inline correctly. Cascade order is
base < components < unlayered: components beat the base resets (e.g. the
form-control `font: inherit`) while consumer styles still override components.

Verified in both the Next web app and Storybook (Vite): CSS loads and a default
Button computes `font-weight: 600`.
