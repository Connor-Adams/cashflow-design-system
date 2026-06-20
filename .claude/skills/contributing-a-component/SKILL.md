---
name: contributing-a-component
description: Use when adding a new React component (primitive) to the Cashflow Design System monorepo (@connor-adams/designsystem) — i.e. anything that creates a new file under packages/ui/src/<group>/. Covers the file set, the barrel + Storybook contract enforced by scripts/validate.mjs, the card/prompt sidecars, and verification.
---

# Contributing a Component

## Overview

A component is **one source file** plus **four wiring/sidecar artifacts**. The
build's hard contract (`scripts/validate.mjs`) FAILS unless the component is both
**barrel-exported** and **storied**. Everything else is sidecar.

The source of truth is `packages/ui/src/`. `_ds_bundle.js`, `_ds_manifest.json`,
`apps/web/src/generated/*`, and `dist/` are **generated and git-ignored** — never
hand-edit them.

> The repo's `CONTRIBUTING.md` is stale: it says `.jsx` + separate `.d.ts` in a
> root `components/` dir and omits the Storybook requirement. Trust THIS skill and
> `scripts/validate.mjs`, not `CONTRIBUTING.md`.

## First, in a fresh worktree

```bash
pnpm install   # else typecheck dies with "Cannot find module 'react'"
```

## The contract (what validate.mjs enforces)

For each `packages/ui/src/<group>/<Name>.tsx`, **FATAL** if missing:
1. A barrel export in `packages/ui/src/index.ts` matching `./<group>/<Name>'`.
2. A story at `apps/storybook/src/<group>/<Name>.stories.tsx`.

`<Name>.prompt.md` and `<Name>.card.html` coverage is reported but **non-fatal**.
Groups: `core data feedback finance navigation overlays forms`.

## Recipe

**Pick the closest existing sibling and mirror it** (e.g. a new feedback box →
copy `feedback/Alert.tsx`). Don't invent structure.

**Sidecar granularity (steps 4 & 5) follows the group you're in.** Some groups
(`core`, `finance`) ship a per-component `<Name>.prompt.md` + `<Name>.card.html`;
others (`feedback`, `data`, `forms`) ship a single grouped `<group>.prompt.md` +
`<group>.card.html`. Match the neighbors — if your group is grouped, **extend the
existing `<group>.*` files**, don't add per-component ones.

1. **`packages/ui/src/<group>/<Name>.tsx`** — `export function <Name>(props): React.JSX.Element`.
   - Types **inline** in the same file: `export interface <Name>Props extends
     React.HTMLAttributes<...>` and any `export type <Name>Variant = '...' | '...'`.
   - Style **only** through CSS custom properties: `var(--primary)`, `var(--radius-md)`,
     `var(--text-body-sm)`, etc. No hard-coded hex, no CSS-in-JS lib, no npm deps.
     Semantic tokens = free dark mode. Reuse the tokens your sibling uses.
   - Add `data-slot="<name>"` (and `data-variant` if variant-bearing).
   - **Icons are `ReactNode` props** — lucide-react is NOT a dependency of
     `packages/ui`. Never `import` an icon library here.
2. **`packages/ui/src/index.ts`** — add, next to its group's other entries:
   ```ts
   export { <Name> } from './<group>/<Name>'
   export type { <Name>Props, <Name>Variant } from './<group>/<Name>'
   ```
3. **`apps/storybook/src/<group>/<Name>.stories.tsx`** — import from the package
   name, one story per meaningful variant. Title is `<Group>/<Name>` (capitalized):
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { <Name> } from '@connor-adams/designsystem'
   const meta: Meta<typeof <Name>> = { title: '<Group>/<Name>', component: <Name> }
   export default meta
   export const Default: StoryObj<typeof <Name>> = {}
   ```
4. **`<Name>.prompt.md` (or the grouped `<group>.prompt.md`)** — one-line "what &
   when", a small JSX usage block, then a variants/props line. Match
   `core/Badge.prompt.md`. **Granularity per the rule above** — extend the grouped
   file if your group uses one.
5. **`packages/ui/src/<group>/<Name>.card.html`** — **copy a sibling card in the
   same group** and edit. Don't write the boilerplate from scratch: it pins exact
   unpkg react/babel script tags + integrity hashes, links `../../styles.css`, loads
   `../../_ds_bundle.js`, and mounts via
   `const { <Name> } = window.CashflowDesignSystem_2cf89d`. First line must be the
   `<!-- @dsCard group="Components" viewport="700x<h>" name="<Name>" subtitle="…" -->`
   comment. **Granularity per the rule above** — extend the grouped
   `<group>.card.html` if your group uses one.

## Versioning

Add a changeset — this drives the version bump and publish. `pnpm changeset` is
**interactive** (blocks without a TTY); in an agent/non-TTY context write the file
directly:
```md
<!-- .changeset/<short-slug>.md -->
---
'@connor-adams/designsystem': minor
---

Add <Name> component.
```
`minor` for a new component. Leave the root `CHANGELOG.md` alone — it's
maintainer-curated, not per-PR.

## Verify before claiming done

```bash
node scripts/validate.mjs                                   # contract gate (must pass)
pnpm --filter @connor-adams/designsystem typecheck          # inline types compile
pnpm --filter @connor-adams/designsystem build              # tsup → dist (grep dist for <Name>)
pnpm typecheck                                              # repo-wide (ui + storybook + web)
pnpm exec changeset status                                  # bump is queued
```
All must pass. Do not report success on a partial run. (`changeset status` also
lists `@connor-adams/web` at `patch` — that's the dependent getting dragged along,
expected, not your doing.)

## Common mistakes

| Mistake | Reality |
|---|---|
| Forgot barrel export or story | `validate.mjs` exits 1 — both are FATAL. |
| `import { Icon } from 'lucide-react'` in the component | Not a dep of `packages/ui`. Take icons as `ReactNode`. |
| Hard-coded color/radius/font | Use `var(--token)`. Breaks dark mode otherwise. |
| Separate `.d.ts` file (per stale CONTRIBUTING.md) | Types go inline in the `.tsx`; tsup emits the `.d.ts`. |
| Hand-edited `_ds_bundle.js` / `_ds_manifest.json` / `dist/` / `apps/web/src/generated/` | All generated + git-ignored. Never touch. |
| Wrote a fresh `.card.html` from scratch | Copy a sibling — the script tags + integrity hashes + mount-global must be exact. |
| Edited root `CHANGELOG.md` instead of a changeset | Changesets drive versioning; CHANGELOG.md is curated separately. |
| Typecheck fails `Cannot find module 'react'` | Fresh worktree — run `pnpm install` first. |
