---
"@connor-adams/designsystem": patch
---

Fix category-icon coverage gaps and the brand-mark path in `CategoryPill`:

- The keyword matcher (`categoryVisual`/`categoryIconName`) wrote rules in the singular against word-boundary anchors, so naturally-plural and spaced names silently fell to the default `tag` glyph. Real misses now resolved: **Games** (`game` → `games?`), **Subscriptions** (`subscription` → `subscriptions?`), and **LuLu Lemon** (added a `lulu lemon` spaced alternative beside `lululemon`).
- `CategoryPill` indexed the stroke-glyph `GLYPHS` registry with an `IconName` that now includes `brand:` marks, which both failed typecheck and would have rendered an empty glyph for a brand category icon. Brand names now render through `Icon` (filled mark in its official color); stroke glyphs keep their inline, tinted rendering.
