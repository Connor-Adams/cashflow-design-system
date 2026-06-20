---
"@connor-adams/designsystem": patch
---

Fix a cascade regression from the `@layer components` change: the token base
element resets (notably `button, input, select, textarea { font: inherit }`)
were still **unlayered**, so they outranked the now-layered component CSS and
wiped out every component's `font-weight`/`font-size`. The `styles.css` manifest
now declares `@layer base, components` and imports the tokens into `layer(base)`,
so components beat the base resets while consumer styles still override
components.
