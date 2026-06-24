---
"@connor-adams/designsystem": minor
---

Add an override seam for category icons so consumers can supply a stored "icon per category" instead of relying solely on keyword inference. `categoryVisual()` / `categoryIconName()` take an optional `overrides` map (category name → `IconName` or full `CategoryVisual`, matched case/punctuation-insensitively); a bare icon name swaps the glyph and keeps the inferred tint. `CategoryPill` gains `iconName` (render a registry glyph by name) and `overrides` props, and `CategoryBreakdown` gains a per-row `iconName` plus a tile-wide `iconOverrides`. Precedence: `icon` (raw node) › `iconName` › `overrides` › keyword inference.
