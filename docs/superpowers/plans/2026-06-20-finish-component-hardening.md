# Finish Component Hardening (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish hardening the 26 `@connor-adams/designsystem` components that still carry redundant **static** inline `style={}` by deleting it so their existing `.css` class becomes the live (consumer-overridable) styling — keeping dynamic inline + the `...style` spread, and all tests green.

**Architecture:** Each affected component already has a colocated `.css` with the base classes AND duplicates those same static properties in an inline `style={}` (which wins, defeating `className` override). The fix is to **remove the static inline properties** (ensuring the `.css` class carries them), preserving (a) the trailing `...style` spread so a consumer's `style` prop still wins, and (b) genuinely-dynamic inline values (computed `width`/`height`/`background: fill`/`transform`). Public APIs are unchanged.

**Tech Stack:** React 19, TypeScript, plain CSS (token-var based), tsup, vitest + @testing-library/react, pnpm workspace + Turbo + changesets. Repo: `Connor-Adams/cashflow-design-system` (`cf-ds-harden` clone, branch `claude/harden-components`).

## Global Constraints

- Run in the DS repo (`/Users/connoradams/Developer/cf-ds-harden`). pnpm workspace; `@connor-adams/tokens` is `workspace:*` so **no GitHub Packages auth needed**. First: `pnpm install` (once).
- Commit author is Connor only — never a `Co-Authored-By` trailer.
- **Public APIs stay identical** (exported names, props). No behavior/visual change — this is a styling-mechanism move.
- **Keep**: the trailing `...style` spread; any `data-slot`/`data-variant` attributes; genuinely-dynamic inline (`style={{ width: px, height: h, background: fill, ...style }}` → keep, it's per-instance).
- **Remove**: static inline properties already (or now) present in the `.css` class (`display`, `gap`, `margin*`, `color`, `font*`, `border*`, `background: var(--…)`, `padding`, `borderRadius`, `boxShadow`, etc.).
- Per-component test: `pnpm -C packages/ui test <NameFragment>`. Typecheck: `pnpm -C packages/ui typecheck`. Full: `pnpm -C packages/ui test`.
- `validate.mjs` contract must stay green (barrel export + a Storybook story per `*.tsx`).

---

## The transform (worked example — `core/Card.tsx`)

`Card.css` already defines `.ca-card` with `border-radius/border/background/color/box-shadow/padding`. The component **duplicates** all of it inline. Remove the duplication:

**Before:**
```tsx
<div
  ref={ref}
  data-slot="card"
  className={className ? `ca-card ${className}` : 'ca-card'}
  style={{
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    background: 'var(--card)',
    color: 'var(--card-foreground)',
    boxShadow: 'var(--shadow)',
    padding: 20,
    ...style,
  }}
  {...props}
>
```
**After:**
```tsx
<div
  ref={ref}
  data-slot="card"
  className={className ? `ca-card ${className}` : 'ca-card'}
  style={style}
  {...props}
>
```
For `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`: if the property set isn't already in `Card.css`, add the class first, then strip the inline. e.g. add to `Card.css`:
```css
.ca-card-header { display: grid; gap: 6px; margin-bottom: 12px; }
.ca-card-title { font-weight: var(--weight-semibold); letter-spacing: -0.01em; font-size: var(--text-headline-sm); color: var(--foreground); }
```
then change each sub-part's `style={{ <those props>, ...style }}` → `style={style}`.

> **Why this is safe:** the rendered styling is identical (the `.css` already carried these values, the inline was a duplicate). The difference: now a consumer's `className` (or `style`) can override, and there's no "inline beats className" trap. The components' existing className-override tests should pass (and where one is missing, add it — see Task steps).

---

### Task 1: Setup + lock the worked example (`core/Card`)

**Files:**
- Modify: `packages/ui/src/core/Card.tsx`, `packages/ui/src/core/Card.css`
- Test: `packages/ui/src/core/Card.test.tsx`

- [ ] **Step 1: Install once**

Run: `cd /Users/connoradams/Developer/cf-ds-harden && pnpm install`
Expected: completes (workspace; no registry auth).

- [ ] **Step 2: Add/confirm a className-override test for Card (fails first if the inline still wins)**

In `Card.test.tsx`, add:
```tsx
it('lets a consumer className override the surface padding', () => {
  const { getByTestId } = render(<Card data-testid="c" className="p-0" />)
  // With styling in .ca-card (not inline), a consumer rule on .p-0 can win.
  expect(getByTestId('c')).toHaveClass('ca-card', 'p-0')
  expect(getByTestId('c').getAttribute('style') ?? '').not.toMatch(/padding/)
})
```
Run: `pnpm -C packages/ui test Card`
Expected: FAIL — the inline `style` still contains `padding`.

- [ ] **Step 3: Apply the transform**

Strip the static inline from `Card` and each sub-part per the worked example; add the missing sub-part classes to `Card.css`. Leave `style={style}` and `data-slot`.

- [ ] **Step 4: Run tests**

Run: `pnpm -C packages/ui test Card`
Expected: PASS (override test + existing render tests).

- [ ] **Step 5: Commit**
```bash
git add packages/ui/src/core/Card.tsx packages/ui/src/core/Card.css packages/ui/src/core/Card.test.tsx
git commit -m "refactor(card): move static styling to .ca-card* classes (drop redundant inline)"
```

---

### Tasks 2-N: the remaining components (same transform, grouped by dir)

For each component below, apply the **exact same transform** as Task 1: ensure the `.css` class carries the static properties (add if missing), delete the static inline (keep `...style` + dynamic inline + `data-*`), run `pnpm -C packages/ui test <Name>` (add a className-override assertion if the file lacks one), commit per component. Skip the inline-strip for any property that is genuinely dynamic.

- [ ] **Task 2 — `core/`:** Link, Progress, Avatar, Kbd, Separator, Spinner. (Avatar's `width/height: px` is dynamic — keep; move only static like `objectFit`/`borderRadius` if mirrored in `.css`.)
- [ ] **Task 3 — `forms/`:** Slider. (Keep the dynamic thumb/track fill `%`; move static track/label styling.)
- [ ] **Task 4 — `overlays/`:** Dialog, Tooltip, DropdownMenu, Toast. (Keep dynamic positioning; move static surface/scrim/padding styling.)
- [ ] **Task 5 — `feedback/`:** Skeleton. (`height: h`/`width: w` are dynamic — keep; move shimmer/radius if inline.)
- [ ] **Task 6 — `data/`:** Table, LetterAvatar. (LetterAvatar `width/height: px` dynamic — keep; move font/radius/colors.)
- [ ] **Task 7 — `finance/`:** PeriodSelector, MoneyInput, AccountCard, Sparkline, BudgetMeter, ImportDropzone, AmountText, CategoryPill. (Sparkline `background: fill`, BudgetMeter/Progress bar `width: %` are dynamic — keep; move static layout/colors.)
- [ ] **Task 8 — `media/`:** ProgressBar, NowPlayingArtwork, QueueList. (ProgressBar `width: %`, artwork dynamic src dims — keep; move static chrome.)

Each task ends green: `pnpm -C packages/ui test` for the touched files + `pnpm -C packages/ui typecheck` clean, then commit `refactor(<dir>): move static styling off inline into .css`.

---

### Task 9: Verify whole package + changeset + publish

**Files:**
- Create: `.changeset/<name>.md`

- [ ] **Step 1: Full gates**
```bash
pnpm -C packages/ui typecheck   # 0 errors
pnpm -C packages/ui test        # all green
node packages/ui/scripts/validate.mjs 2>/dev/null || pnpm -w validate   # contract intact (whichever the repo uses)
pnpm -C packages/ui build       # tsup + CSS build emits dist
```

- [ ] **Step 2: Confirm no static inline remains**

Run from repo root:
```bash
grep -rl 'style={{' packages/ui/src --include='*.tsx' | grep -v test | grep -v stories \
 | while read f; do echo "== $f =="; grep -oE 'style=\{\{[^}]*\}\}' "$f"; done
```
Expected: every remaining `style={{…}}` contains only dynamic values (`width`/`height`/`background: <var>`/`transform`/computed) plus `...style`. No static `display/color/font/border/padding/margin` literals.

- [ ] **Step 3: Changeset (minor bump → 0.3.0)**
```bash
cat > .changeset/finish-component-hardening.md <<'EOF'
---
"@connor-adams/designsystem": minor
---

Finish component hardening: move residual static inline styles into each
component's CSS class so consumer `className` overrides work everywhere (no more
"inline beats className"). Dynamic inline (sizes/fills) and the `...style` spread
are preserved. No public API or visual change.
EOF
git add .changeset/finish-component-hardening.md
git commit -m "chore: changeset — finish component hardening (minor)"
```

- [ ] **Step 4: Push + open PR (Connor merges → release workflow publishes 0.3.0)**
```bash
git push -u origin claude/harden-components
gh pr create --repo Connor-Adams/cashflow-design-system --base main \
  --title "Finish component hardening: static inline → CSS classes" \
  --body "Completes the inline→CSS migration for the 26 partially-hardened components. Drops redundant static inline so .css classes are the live, overridable styling. Dynamic inline + ...style preserved. No API/visual change. Minor bump (0.3.0). Spec: docs/superpowers/specs/2026-06-20-finish-component-hardening-design.md"
```
> Publishing to GitHub Packages happens on merge to `main` via the existing changesets release workflow — Connor's action.

---

## Phase 2 (separate plan, later)

Upgrade cashflow to `@connor-adams/designsystem@^0.3.0`, swap the dashboard category tile to DS `CategoryBreakdown` (supersedes PR #951), drop the `style={{ x: undefined }}` clear-tricks, verify. Gated on: this plan published + `gh` auth refreshed + the cashflow DS-consolidation fleet settled. A dedicated plan will be written then.

## Self-Review

- **Spec coverage:** finish-26 (static inline → CSS) → Tasks 1-8; verify + changeset + publish-PR → Task 9; Phase 2 explicitly deferred. ✓
- **Placeholder scan:** the per-dir tasks (2-8) intentionally apply the *worked example's* exact transform rather than re-printing 26 near-identical diffs — the transformation is uniform and shown in full in Task 1 + the "transform" section; each component's specific static props are read from its own file (a refactor, not new code). Dynamic-vs-static guidance is concrete per task. ✓
- **Type consistency:** no new types; `style={style}` preserves the existing `style?: React.CSSProperties` prop. ✓
- **Safety:** every task gated by `pnpm test` (render + override) + typecheck; APIs unchanged. ✓
