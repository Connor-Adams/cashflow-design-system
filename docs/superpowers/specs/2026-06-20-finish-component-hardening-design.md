# Finish Component Hardening + Cashflow Upgrade — Design

**Status:** Approved (brainstorming) — 2026-06-20

## Context

`@connor-adams/designsystem` is already largely hardened (v0.2.0): 50 components
ship a colocated `.css` class, use `React.forwardRef`, have open prop interfaces
(`extends React.HTMLAttributes`), CSS `:hover`/`:focus-visible` states (no JS
hover), and ~50 test files. This finishes the job and delivers it to the app.

Two findings drive this work:
1. **26 components still carry inline `style={}}`** — but all already have a
   `.css` file. The inline styles are a *mix*: some are genuinely **dynamic**
   (per-instance sizes/fills — correct to keep inline), others are **static**
   styling that still belongs in the CSS class (where it can't be overridden by a
   consumer's `className` — the "inline beats className" defect).
2. **cashflow consumes `@connor-adams/designsystem@^0.1.0`** — the un-hardened
   prototype. None of the hardening reaches the app; this is the root of the
   friction the migration workers kept fighting. The app also has a brand-new DS
   component available — **`CategoryBreakdown`** — that its dashboard should use.

## Goal

Phase 1: complete the inline→CSS migration for the residual **static** inline
styles in the 26 components (DS repo), keeping public APIs stable. Phase 2:
upgrade cashflow to the published result, adopt `CategoryBreakdown` on the
dashboard, and remove the workaround code the prototype forced.

## Phase 1 — finish the 26 (DS repo, `cf-ds-harden`)

For each component below, move **static** inline styling into its existing `.css`
class (keyed by `data-slot`/`data-variant`, referencing `@connor-adams/tokens`
vars). **Keep** genuinely-dynamic inline (`width`/`height`/`background: fill`/
`transform` computed per render) and **keep** the trailing `...style` spread (so a
consumer's `style` prop still wins). Components whose only remaining inline style
is dynamic are **already correct** — verify and skip.

The 26 (consumer-facing; each already has a `.css`):
`core/`: Card, Link, Progress, Avatar, Kbd, Separator, Spinner ·
`forms/`: Slider · `overlays/`: Dialog, Tooltip, DropdownMenu, Toast ·
`feedback/`: Skeleton · `data/`: Table, LetterAvatar ·
`finance/`: PeriodSelector, MoneyInput, AccountCard, Sparkline, BudgetMeter,
ImportDropzone, AmountText, CategoryPill · `media/`: ProgressBar,
NowPlayingArtwork, QueueList.

Rule of thumb per component:
- `style={{ display:'grid', gap, marginBottom, color:'var(--…)', … }}` → move to
  the `.css` class.
- `style={{ width: px, height: h, background: fill }}` (computed) → leave inline.
- Always preserve `...style` last and any `data-slot`/`data-variant` hooks.

**Definition of done (Phase 1):**
- For each component, `grep "style={{"` shows only dynamic values + `...style`.
- `pnpm -C packages/ui typecheck` clean; `pnpm -C packages/ui test` green
  (existing tests assert `className` override + render; add an override assertion
  where a component lacked one).
- `validate.mjs` contract intact (barrel export + Storybook story per component).
- One **changeset**, **minor bump → 0.3.0** (additive/non-breaking), merged to
  `main` → published to GitHub Packages by the existing release workflow.

Phase 1 is self-contained: the DS repo is a pnpm workspace (`@connor-adams/tokens`
is `workspace:*`), so `pnpm install`/build/test need **no** GitHub Packages auth.

## Phase 2 — upgrade cashflow (after Phase 1 publishes)

In the cashflow repo:
1. **Bump** `@connor-adams/designsystem` + `@connor-adams/tokens` from `^0.1.0`
   to the new `^0.3.0` in `frontend/package.json`; `corepack yarn install`
   (needs `NODE_AUTH_TOKEN` — see blocker).
2. **Adopt `CategoryBreakdown`** on the dashboard. Replace the hand-rolled
   category bars (PR #951) in `DashboardPage`'s "Net spend by category" tile with
   the DS component:
   ```tsx
   <CategoryBreakdown
     rows={chartData.map((c) => ({ category: c.name.toLowerCase(), label: c.name, amount: -c.total }))}
     currency={displayCurrency || undefined}
     trend={/* monthly net-spend series, if wiring the sparkline */}
     onSelect={(category) => navigateToCategory(category)}
   />
   ```
   This supersedes the #951 markup and gets the trend sparkline for free.
3. **Remove workarounds:** delete the `style={{ padding: undefined }}` /
   `style={{ <prop>: undefined }}` clear-tricks the migration workers added (now
   unnecessary — the hardened DS applies styling via overridable CSS classes).
4. **Verify:** `(cd frontend && tsc -b)` 0 errors, `lint` + `lint:palette` clean,
   `yarn workspace frontend run test` green, `vite build` clean.

## Sequencing & blockers

- **Auth:** my `gh` token returns 401 on GitHub Packages right now. Phase 1 needs
  no auth. Phase 2 (install/publish-verify) needs the token refreshed
  (`unset GH_TOKEN GITHUB_TOKEN; gh auth refresh -s read:packages`).
- **Publish:** Phase 2 waits on Phase 1's 0.3.0 being published (your release flow
  runs on merge to the DS repo's `main`).
- **In-flight cashflow fleet:** the DS-consolidation fleet (#937/#938-remainder/
  #939) is still landing on cashflow `main`. Do Phase 2 **after** it settles to
  avoid churn; some of its leftover workarounds are exactly what Phase 2 removes.

## Out of scope

- New DS components / features. Net-new visual redesign. App pages other than the
  dashboard category tile.
