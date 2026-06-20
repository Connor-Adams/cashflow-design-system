---
name: contributing-a-token
description: Use when adding or changing a design token (CSS custom property — color, radius, shadow, spacing, type) in the Cashflow Design System, i.e. editing packages/tokens/src/*.css. Covers the raw-ramp → semantic-alias layering, the two-theme contract, and the foundation gallery card.
---

# Contributing a Token

## Overview

Tokens are CSS custom properties layered in **two tiers**, both under
`packages/tokens/src/`:

1. **Raw ramps** (`colors.css`, etc.) — primitive scales like `--zinc-500`,
   `--oxblood-500`, `--green-600`. **Components never use these directly.**
2. **Semantic aliases** (`semantic.css`) — the layer everything reaches through:
   `--primary`, `--muted-foreground`, `--positive`, `--radius-md`. These point AT
   the raw ramps.

`packages/tokens/styles.css` is an `@import` manifest only (order: fonts → colors →
semantic → typography → spacing → base). `packages/ui/styles.css` just re-imports
the tokens package. There is **no central token registry** — the foundation cards
under `foundations/` are the gallery.

> `CONTRIBUTING.md` is stale (says `tokens/*.css` at root + bump `package.json`).
> Real source is `packages/tokens/src/`; versioning is changesets (below).

## The two-theme contract

`semantic.css` defines the SAME token names in two blocks. **A semantic token must
appear in both** or dark mode silently breaks:

```css
:root,
:root[data-theme="light"] { --positive-bg: var(--green-100); }
:root[data-theme="dark"]  { --positive-bg: #0C2418; }
```

Dark mode is the same layer re-pointed — never a separate stylesheet. Note the
asymmetry: light surface tints **alias a ramp step** (`var(--green-100)`), but dark
surface tints are **hand-tuned hexes** (there's no near-black step in the ramps).
"Mirror the sibling" means match that pattern, not use a `var()` on both sides.

## Recipe

1. **Need a new primitive value?** Add it to the raw ramp in `colors.css` (or the
   relevant raw file) first. Reuse an existing ramp step if one fits — don't invent
   a near-duplicate hex.
2. **Add the semantic alias** in `semantic.css`, in **both** theme blocks, placed in
   the matching section (Money, Signals, Surfaces…). Mirror the nearest sibling:
   - Signal tints come as a triad `--x` / `--x-bg` / `--x-foreground`.
   - Money: `--positive` (green / money-in), `--negative` (oxblood / money-out).
     Keep `--danger` (stop-red) distinct from `--destructive` and from oxblood —
     they're deliberately separate so brand-red and alert-red never blur.
3. **Add/extend a foundation card** in `foundations/<group>.html` so the token shows
   in the Design System tab. First line is the marker:
   `<!-- @dsCard group="…" viewport="700x<h>" name="…" subtitle="…" -->`.
   Foundation cards are **pure CSS demos** (no `_ds_bundle.js`, no React mount —
   unlike component cards). Copy a sibling card and edit; bump the viewport height
   if you add a tile.

## Versioning

`pnpm changeset` (interactive — or write `.changeset/<slug>.md` directly) selecting
**`@connor-adams/tokens`**, `minor` for a new token, `patch` for retuning a value,
`major` for removing/renaming one. `updateInternalDependencies: patch` means the UI
package's dep range bumps automatically. Leave root `CHANGELOG.md` to the maintainer.

## Verify

No build gate covers tokens (`scripts/validate.mjs` is components-only). Run
`pnpm install` first if `changeset` is "command not found" (fresh worktree). Verify by:
- the new `--name` is present in **both** theme blocks (`grep -n -- '--name' packages/tokens/src/semantic.css`),
- every `var(--…)` it references actually exists,
- `pnpm exec changeset status` shows the tokens bump queued.

## Common mistakes

| Mistake | Reality |
|---|---|
| Defined the token in only the light block | Dark mode breaks. Both blocks, always. |
| Component points at a raw ramp (`var(--green-600)`) | Reach through a semantic alias; raw ramps are private. |
| Invented a new hex instead of an existing ramp step | Reuse the ramp; add a ramp step only if none fits. |
| `--danger` and `--destructive` collapsed into one | Kept separate on purpose. Don't merge. |
| Expected the foundation card to render standalone | Cards link `../styles.css` (a path that doesn't resolve post-monorepo) — known tech debt; they render in the gallery harness, not by opening the file. |
| Bumped `packages/tokens/package.json` by hand | Changesets own version numbers. Add a changeset instead. |
