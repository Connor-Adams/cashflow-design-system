---
"@connor-adams/designsystem": patch
---

Ship component CSS in `@layer components` (via the `styles.css` import) so a
consumer's styles — Tailwind utilities (which sit in `@layer utilities`, after
`components`) or any unlayered rule — override a component's own styling through
`className`. Without the layer, the unlayered component classes won the cascade
against consumer utilities.
