# Web Agent Inventory — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)

## Problem

External AI coding agents working in *other* projects have no way to discover what the Cashflow Design System (`@connor-adams/designsystem`) offers — which components exist, their categories, props, and how to import them. The web app already generates this data at build time but never serves it in an agent-consumable form.

## Goal

Serve a machine-readable component inventory from `apps/web` at stable URLs, generated from the existing build-time data so it never drifts from the actual library.

Scope this iteration: **components only**. Icons are deferred (see Out of Scope).

## Consumer & Format (decided)

- **Consumer:** external agent via web URL — wants a fetchable artifact, not a committed-in-package file.
- **Format:** both
  - `/llms.txt` — markdown, [llms.txt](https://llmstxt.org/) convention, human + agent skimmable.
  - `/components.json` — structured JSON, full prop schemas, for precise machine parsing.

## Approach

Extend the existing generator [`apps/web/scripts/gen-data.mjs`](../../../apps/web/scripts/gen-data.mjs) — it already runs before `next build` and scans `packages/ui/src/<category>/*.tsx`, producing `apps/web/src/generated/manifest.json`, `props.json`, and `usage.json`. Add a final step that composes those three in-memory results into two new files written to `apps/web/public/`.

Rejected alternatives:
- **Next.js route handlers** (`app/llms.txt/route.ts`, `app/api/components.json/route.ts`) — buys dynamic computation and custom headers, neither needed for static build-time data. More moving parts, requires server runtime.
- **Hand-maintained `llms.txt`** — rots the moment a component is added.

Reusing the existing component scan means the new outputs inherit the `.test.tsx` exclusion already in `gen-data.mjs` — no `.test` entries leak into the inventory.

## Outputs

### `apps/web/public/components.json`

```json
{
  "package": "@connor-adams/designsystem",
  "version": "<read from packages/ui/package.json>",
  "import": "import { <Name> } from '@connor-adams/designsystem'",
  "categories": ["core", "data", "feedback", "finance", "forms", "navigation", "overlays"],
  "components": [
    {
      "slug": "button",
      "name": "Button",
      "category": "core",
      "docs": "<BASE>/components/button",
      "summary": "<first non-empty line of usage entry>",
      "props": [
        { "name": "variant", "type": "...", "required": false, "defaultValue": "...", "description": "..." }
      ]
    }
  ]
}
```

- `version` read from `packages/ui/package.json`.
- `props` taken verbatim from the in-memory props result (same shape as `props.json`).
- `summary` — first non-empty line of the component's `usage.json` entry (sourced from its `.prompt.md`); fallback `"<Name> component"` when no usage exists.
- `components` ordered by category (using the existing category order), then by name within a category.

### `apps/web/public/llms.txt`

```
# Cashflow Design System

> React component library (@connor-adams/designsystem). <N> components across <M> categories. All components are imported from the package root.

Full inventory with prop schemas: <BASE>/components.json

## Core
- [Button](<BASE>/components/button): <summary>. Props: variant, size, disabled.
- ...

## Forms
- ...
```

- One `##` section per category (in existing category order); skip empty categories.
- One bullet per component: `- [<Name>](<BASE>/components/<slug>): <summary>. Props: <up to ~6 prop names>.`
- Prop names only here (full schemas live in `components.json`).
- `<N>`, `<M>` computed from the data.

## Base URL

```js
const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
```

- Unset → relative links (`/components/button`, `/components.json`).
- Set in deploy → absolute links.

## Persistence

Both files are **committed**, not gitignored — matching the existing `apps/web/src/generated/*.json` convention. Keeps diffs visible in review and ensures the files exist without requiring a fresh build.

## Verification

In `gen-data.mjs`, after writing:
- Assert `components.json`'s component count equals the manifest count. Mismatch → throw, failing the build loudly.
- Assert `llms.txt` is non-empty.

Manual:
- `pnpm --filter web build` (or the repo's build command), then `curl localhost:3001/llms.txt` and `curl localhost:3001/components.json` against a running server / static output.

## Out of Scope

- **Icons.** No icon primitive exists — icons are inline SVG paths inside component source (e.g. the `ICONS` map in `packages/ui/src/finance/CategoryPill.tsx`). Nothing to enumerate. Revisit after an exported icon set exists.
- **npm-package embedding** — inventory is not shipped inside the published package this iteration.
- **Route handlers / dynamic API.**
