# Contributing to the Cashflow Design System

A **living design system** distributed as two npm packages on GitHub Packages:
`@connor-adams/designsystem` (`packages/ui`) and `@connor-adams/tokens`
(`packages/tokens`). The source of truth is the token CSS and the React component
sources; the bundle, manifests, and generated web data are derived.

> **Agents:** step-by-step playbooks live in `.claude/skills/`. Use the matching
> skill — it carries the exact recipe, the validation gate, and the known footguns:
> `contributing-a-component`, `contributing-a-token`, `contributing-a-template`,
> `releasing`.

## Source of truth

| What | Where |
|---|---|
| Components | `packages/ui/src/<group>/<Name>.tsx` (+ `.prompt.md`, `.card.html` sidecars) |
| Component barrel | `packages/ui/src/index.ts` — every component is exported here |
| Stories | `apps/storybook/src/<group>/<Name>.stories.tsx` |
| Tokens | `packages/tokens/src/*.css` (raw ramps → semantic aliases on `:root`) |
| Token entry | `packages/tokens/styles.css` (an `@import` manifest only) |
| Foundation cards | `foundations/*.html` |
| Templates | `templates/<slug>/` |
| Brand assets | `assets/` |

**Never edit** — all generated and git-ignored: `_ds_bundle.js`, `_ds_manifest.json`,
`_adherence.oxlintrc.json`, `dist/`, `apps/web/src/generated/*`.

`groups`: `core` · `data` · `feedback` · `finance` · `forms` · `navigation` ·
`overlays`.

## Adding a component

Five artifacts; the contract gate `node scripts/validate.mjs` **fails** unless the
component is both **barrel-exported** and **storied**:

1. `packages/ui/src/<group>/<Name>.tsx` — `export function <Name>` with the props
   `interface` and any variant types **inline** in the same file. Style only through
   CSS custom properties (`var(--token)`) — no CSS-in-JS, no npm deps, no hard-coded
   hex. Icons are `ReactNode` props (no icon library in `packages/ui`).
2. `packages/ui/src/index.ts` — `export { <Name> }` + `export type { … }`. **FATAL** if missing.
3. `apps/storybook/src/<group>/<Name>.stories.tsx`. **FATAL** if missing.
4. `<Name>.prompt.md` and `<Name>.card.html` sidecars — **granularity follows the
   group**: `core`/`finance` are per-component; `feedback`/`data`/`forms` share a
   grouped `<group>.prompt.md` / `<group>.card.html`. Match the neighbours.

Full recipe + verification: skill `contributing-a-component`.

## Adding tokens

Add the raw value to a ramp file (`packages/tokens/src/colors.css`, …) only if no
existing step fits, then add the **semantic alias** in `packages/tokens/src/semantic.css`
in **both** theme blocks (`:root,:root[data-theme="light"]` and
`:root[data-theme="dark"]`) — a token defined in only one block breaks dark mode. Add
or extend a `foundations/*.html` card (pure-CSS, `@dsCard`-tagged) so it shows in the
Design System tab. Full recipe: skill `contributing-a-token`.

## Adding a template

A `templates/<slug>/` dir is `<Name>.dc.html` plus `support.js` and `ds-base.js`
**copied byte-identical** from an existing template. The `.dc.html` opens with a
`<!-- @template … -->` marker and mounts components via `<x-import>`. Full recipe:
skill `contributing-a-template`.

## Versioning & releases

Versioning is **changesets**, not manual edits. For any change to a package's public
API or a token value, run `pnpm changeset` (or write `.changeset/<slug>.md` directly)
selecting the affected package(s) and bump level. CI (`.github/workflows/release.yml`,
on push to `main`) opens a "version packages" PR; merging it publishes to GitHub
Packages. Do **not** hand-bump `package.json`. The root `CHANGELOG.md` is a
human-curated summary, separate from the changeset-generated per-package changelogs —
leave it to the maintainer. Full flow + irreversible-step warnings: skill `releasing`.
