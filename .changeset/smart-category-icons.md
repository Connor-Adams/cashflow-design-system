---
"@connor-adams/designsystem": minor
---

CategoryPill now infers its icon and tint from free-text category/merchant names by keyword instead of an exact-match lookup over 8 fixed keys. Names like "Eating Out", "cc fees", "Vape", "Office Equipment", "Spotify", and "Amazon" now get sensible glyphs (brand names resolve ahead of generic words) rather than falling to a generic default. Exposes `categoryVisual()` and `categoryIconName()` for consumers that need the mapping directly, and exports the `GLYPHS` registry from the icon module.
