---
name: contributing-a-template
description: Use when adding a new full-page template/composition to the Cashflow Design System under templates/<slug>/ — a composed example screen built from the library's components. Covers the .dc.html anatomy, the x-dc runtime files to copy verbatim, component mounting via x-import, and how templates are surfaced.
---

# Contributing a Template

## Overview

A template is a **self-contained HTML mini-app** rendered by an embedded runtime
(`x-dc`), NOT a React/Storybook artifact. Each lives in `templates/<slug>/` and is
three files:

| File | What | Action |
|---|---|---|
| `<Name>.dc.html` | the page itself | **write** |
| `support.js` | the `x-dc` runtime (~54KB, generated from `dc-runtime`, not in this repo) | **copy byte-identical** from an existing template |
| `ds-base.js` | loads tokens + `_ds_bundle.js`, exposes the component global | **copy byte-identical** from an existing template |

`ds-base.js` hard-codes `const base = '../..'` — the path from `templates/<slug>/` up
to repo root. It's correct **only** because every template sits exactly two levels
deep. Don't nest templates deeper, or the bundle won't load.

`.thumbnail` is optional (cashflow-app has one, transactions doesn't).

> Don't hand-write `support.js`/`ds-base.js` — they're generated/shared. Copy from
> `templates/transactions/` and verify identical (`diff`). `dc-runtime` isn't in
> this repo, so you can't regenerate `support.js`.

## `.dc.html` anatomy

Mirror `templates/transactions/Transactions.dc.html`. Structure:

```html
<head>… <script src="./support.js"></script> …</head>
<body>
<x-dc>
  <!-- @template name="Monthly Budget" description="…" -->   <!-- FIRST child: surfacing marker -->
  <helmet><script src="./ds-base.js"></script></helmet>      <!-- hoists the DS loader -->

  <!-- page markup: plain divs/sections styled ONLY via var(--token) — no hex -->
  <x-import component-from-global-scope="CashflowDesignSystem_2cf89d.StatCard"
            label="Spent" value="{{ spent }}" metric-kind="spend" hint-size="100%,96px">
  </x-import>

  <sc-for list="{{ rows }}" as="row" hint-placeholder-count="3">
    <x-import component-from-global-scope="CashflowDesignSystem_2cf89d.BudgetMeter" …></x-import>
  </sc-for>

  <script type="text/x-dc" data-dc-script>
    class Component extends DCLogic {
      renderVals() { return { spent: 1240, rows: [/* … */] } }
    }
  </script>
</x-dc>
</body>
```

- **Mount components** with `<x-import component-from-global-scope="CashflowDesignSystem_2cf89d.<Name>" …>`. The `_2cf89d` global name is **fixed** — copy it verbatim from a sibling template; it's not per-template. Props are **kebab-cased** attributes (`metric-kind`, `warn-at`). `hint-size="W,H"` is the pre-hydration placeholder size.
- **Dynamic data**: `{{ expr }}` interpolation; `<sc-for list="{{ arr }}" as="item" hint-placeholder-count="N">` loops. Values come from `renderVals()` in the bottom `data-dc-script` block (extend `DCLogic`; add `state`/`setState` for interactivity — see transactions).
- Use only components that exist — every `component-from-global-scope` name must be barrel-exported from `@connor-adams/designsystem`.

## Surfacing

Templates are surfaced by the `@template` marker + the Launch preview panel. They are
**NOT** in `apps/web` (that manifest is components-only) and there's **no template
manifest** file. The `README.md` file/dir table is **directory-level** (one
`templates/` row, not one row per template) — mention the new template in that
existing row, don't add a new row.

## Verify

The `_ds_bundle.js` that `ds-base.js` loads is git-ignored and absent in-repo, so the
template **can't be rendered/hydrated standalone here** (the existing templates have
the same situation). Verify structurally instead:
- `support.js` and `ds-base.js` are byte-identical to the source template (`diff`).
- every component you mount is barrel-exported (`grep` `packages/ui/src/index.ts`),
- every prop value is within that component's TS prop contract (open the `.tsx` —
  e.g. confirm a `metric-kind`/`category`/`variant` value is in its union),
- `node scripts/validate.mjs` still passes (it won't break on templates, but confirms
  you didn't disturb the component contract).

## Common mistakes

| Mistake | Reality |
|---|---|
| Hand-edited or regenerated `support.js`/`ds-base.js` | Copy byte-identical from a sibling template. `dc-runtime` isn't here. |
| Omitted the `<!-- @template … -->` marker, or not first child | It's the surfacing contract — first child inside `<x-dc>`. |
| camelCase props on `x-import` | Attributes are kebab-cased (`metric-kind`, not `metricKind`). |
| Mounted a component that isn't exported | `component-from-global-scope` names must be barrel-exported. |
| Hard-coded a color in the markup | Style only through `var(--token)`. |
| Used a prop value outside the component's union | Check the `.tsx`; invalid values fall back or break silently. |
| Expected the file to render by opening it | `_ds_bundle.js` is generated/absent; verify structurally. |
