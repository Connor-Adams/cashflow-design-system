---
"@connor-adams/designsystem": patch
---

Ship component CSS in `@layer components` so consumer styles (Tailwind
utilities or any unlayered rule) override a component's own styling via
`className`. The earlier attempt at this was reverted because it layered the
components but left the token base resets unlayered — so
`button, input, select, textarea { font: inherit }` outranked the layered
components and wiped out their `font-weight`/`font-size`. This version declares
`@layer base, components` and imports the tokens into `layer(base)`, so the
order is base < components < unlayered: components beat the base resets, and
consumer styles still override components.
