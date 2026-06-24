# Fold BrandLogo into Icon — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make brand/merchant logos addressable through the `Icon` component via a `brand:` name prefix, and remove the standalone `BrandLogo` component.

**Architecture:** Extract BrandLogo's path data into a plain `.ts` data module (`brandGlyphs.ts`). `Icon` imports it, extends `IconName` with `\`brand:${BrandSlug}\``, and branches at render: a `brand:`-prefixed name renders a single filled `<path>` (fill = official color when `brand` is set, else `currentColor`); everything else is the existing stroke render, untouched. `BrandLogo` and its five-file surface are then deleted. Breaking change → major version bump.

**Tech Stack:** React 18, TypeScript, tsup, Vitest + Testing Library, Storybook, Changesets, pnpm workspaces + turbo.

## Global Constraints

- Package: `@connor-adams/designsystem` (`packages/ui`), currently `0.11.0`. This change is a **major** bump (public API removal).
- Component structural contract (`scripts/validate.mjs`): every `.tsx` in a `core/…` category dir must be (a) referenced in `packages/ui/src/index.ts` and (b) have a matching `apps/storybook/src/<cat>/<Name>.stories.tsx`. `.ts` files are exempt.
- Brand glyphs reuse the existing `.ca-icon` CSS class — no CSS change needed (`.ca-brand-logo` adds nothing `.ca-icon` lacks).
- Brand SVGs are filled single paths on a 24×24 viewBox; `strokeWidth`/`strokeLinecap` do not apply to them.
- `brandColors` values are 6-digit hex (`/^#[0-9A-Fa-f]{6}$/`).
- Do not alter the brand path data or add new brand marks.

**Commands** (run from repo root):
- Single UI test file: `pnpm --filter @connor-adams/designsystem exec vitest run <relpath>`
- All UI tests: `pnpm --filter @connor-adams/designsystem test`
- UI typecheck: `pnpm --filter @connor-adams/designsystem typecheck`
- Contract: `pnpm validate`
- Full build: `pnpm build`

---

### Task 1: Extract brand data into `brandGlyphs.ts`

**Files:**
- Create: `packages/ui/src/core/brandGlyphs.ts`
- Create: `packages/ui/src/core/brandGlyphs.test.ts`
- Reference (read-only, copy from): `packages/ui/src/core/BrandLogo.tsx:15-268` (`LOGOS`), `:271-525` (`brandColors`)

**Interfaces:**
- Produces: `LOGOS` (`Record<string,string>` of slug→SVG path), `BrandSlug` (`keyof typeof LOGOS`), `brandColors` (`Record<BrandSlug,string>`), `brandSlugs` (`BrandSlug[]`).

- [ ] **Step 1: Write the failing test**

Create `packages/ui/src/core/brandGlyphs.test.ts`:

```ts
import { LOGOS, brandColors, brandSlugs } from './brandGlyphs'

describe('brandGlyphs', () => {
  it('exposes a string path for every slug', () => {
    expect(brandSlugs).toContain('spotify')
    expect(brandSlugs.length).toBeGreaterThan(20)
    for (const s of brandSlugs) expect(typeof LOGOS[s]).toBe('string')
  })

  it('has a valid 6-digit hex color for every slug', () => {
    for (const s of brandSlugs) expect(brandColors[s]).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @connor-adams/designsystem exec vitest run src/core/brandGlyphs.test.ts`
Expected: FAIL — cannot resolve `./brandGlyphs`.

- [ ] **Step 3: Create the data module**

Create `packages/ui/src/core/brandGlyphs.ts`. Copy the `LOGOS` object literal **verbatim** from `BrandLogo.tsx` lines 15–268 (the `const LOGOS = { … } satisfies Record<string, string>`) and the `brandColors` object **verbatim** from lines 271–525. Then add the slug type and list. Final shape:

```ts
// name → single SVG path on a 24×24 viewBox, filled. Source: Simple Icons (CC0).
const LOGOS = {
  'adidas': "m24 19.535-8.697-15.07-4.659 2.687 7.145 12.383Z…",
  // …copy ALL entries verbatim from BrandLogo.tsx:15-268…
} satisfies Record<string, string>

/** Every brand slug available as `brand:<slug>` on `<Icon>`. */
export type BrandSlug = keyof typeof LOGOS

/** Official brand colors, keyed by slug. */
export const brandColors: Record<BrandSlug, string> = {
  'adidas': "#0096D6",
  // …copy ALL entries verbatim from BrandLogo.tsx:271-525…
}

/** All brand slugs, alphabetical — handy for galleries/pickers. */
export const brandSlugs = Object.keys(LOGOS) as BrandSlug[]

export { LOGOS }
```

Note: `BrandLogo.tsx` keeps its own inline copy of this data for now (deleted in Task 3). Temporary duplication is intentional and short-lived.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @connor-adams/designsystem exec vitest run src/core/brandGlyphs.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Typecheck**

Run: `pnpm --filter @connor-adams/designsystem typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/core/brandGlyphs.ts packages/ui/src/core/brandGlyphs.test.ts
git commit -m "feat(ui): extract brand glyph data into brandGlyphs module"
```

---

### Task 2: Route brand glyphs through `Icon`

**Files:**
- Modify: `packages/ui/src/core/Icon.tsx`
- Modify: `packages/ui/src/core/Icon.test.tsx`

**Interfaces:**
- Consumes: `LOGOS`, `brandColors`, `brandSlugs`, `BrandSlug` from `./brandGlyphs` (Task 1).
- Produces: `IconName = keyof typeof GLYPHS | \`brand:${BrandSlug}\``; `IconProps.brand?: boolean`; `iconNames` now includes `brand:`-prefixed entries.

- [ ] **Step 1: Write the failing tests**

Append these cases inside the `describe('Icon', …)` block in `packages/ui/src/core/Icon.test.tsx`, and add `brandColors` to the imports.

Change line 3 from:
```ts
import { Icon, iconNames } from './Icon'
```
to:
```ts
import { Icon, iconNames } from './Icon'
import { brandColors } from './brandGlyphs'
```

Add before the closing `})` of the describe block:
```tsx
  it('renders a brand glyph as a filled path with currentColor by default', () => {
    const { container } = render(<Icon name="brand:spotify" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveClass('ca-icon')
    expect(svg).toHaveAttribute('data-icon', 'brand:spotify')
    expect(svg).toHaveAttribute('data-brand', 'spotify')
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg.querySelector('path')).toBeInTheDocument()
  })

  it('fills a brand glyph with its official color when brand is set', () => {
    const { container } = render(<Icon name="brand:spotify" brand />)
    expect(container.querySelector('svg')).toHaveAttribute('fill', brandColors.spotify)
  })

  it('leaves stroke glyphs unfilled and brand-prop-agnostic', () => {
    const { container } = render(<Icon name="wallet" brand />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('includes brand names in iconNames', () => {
    expect(iconNames).toContain('brand:spotify')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @connor-adams/designsystem exec vitest run src/core/Icon.test.tsx`
Expected: FAIL — new cases error (no brand branch; `data-brand` absent; type error on `brand` prop).

- [ ] **Step 3: Implement the brand branch in `Icon.tsx`**

Add the import after line 2 (`import './Icon.css'`):
```tsx
import { LOGOS, brandColors, brandSlugs, type BrandSlug } from './brandGlyphs'
```

Replace the `IconName` type (line 315) and `iconNames` export (line 318):
```tsx
/** Every glyph name available to `<Icon name>` — stroke glyphs and `brand:` marks. */
export type IconName = keyof typeof GLYPHS | `brand:${BrandSlug}`

/** All registered icon names — stroke glyphs first, then `brand:`-prefixed marks. */
export const iconNames = [
  ...(Object.keys(GLYPHS) as (keyof typeof GLYPHS)[]),
  ...brandSlugs.map((s) => `brand:${s}` as const),
] as IconName[]
```

Add `brand` to `IconProps` (after the `strokeWidth` field, ~line 326):
```tsx
  /** Render a `brand:` glyph in its official color instead of `currentColor`. No-op on stroke glyphs. */
  brand?: boolean
```

Replace the component body. Destructure `brand` and branch on the prefix before the existing stroke render:
```tsx
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 20, strokeWidth = 2, brand = false, title, className, ...props },
  ref,
): React.JSX.Element {
  if (name.startsWith('brand:')) {
    const slug = name.slice(6) as BrandSlug
    return (
      <svg
        ref={ref}
        data-slot="icon"
        data-icon={name}
        data-brand={slug}
        className={className ? `ca-icon ${className}` : 'ca-icon'}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={brand ? brandColors[slug] : 'currentColor'}
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <path d={LOGOS[slug]} />
      </svg>
    )
  }
  const glyph = GLYPHS[name as keyof typeof GLYPHS]
  return (
    <svg
      ref={ref}
      data-slot="icon"
      data-icon={name}
      className={className ? `ca-icon ${className}` : 'ca-icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {glyph}
    </svg>
  )
})
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @connor-adams/designsystem exec vitest run src/core/Icon.test.tsx`
Expected: PASS (all original + 4 new cases).

- [ ] **Step 5: Typecheck**

Run: `pnpm --filter @connor-adams/designsystem typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/core/Icon.tsx packages/ui/src/core/Icon.test.tsx
git commit -m "feat(ui): render brand: glyphs through Icon"
```

---

### Task 3: Remove the `BrandLogo` component surface

**Files:**
- Delete: `packages/ui/src/core/BrandLogo.tsx`, `BrandLogo.css`, `BrandLogo.test.tsx`, `BrandLogo.card.html`, `BrandLogo.prompt.md`
- Delete: `apps/storybook/src/core/BrandLogo.stories.tsx`
- Modify: `packages/ui/src/index.ts:17-18`

**Interfaces:**
- Removes from public API: `BrandLogo`, `BrandLogoProps`, `BrandName`, `brandNames`, `brandColors`.

- [ ] **Step 1: Delete the BrandLogo files**

```bash
git rm packages/ui/src/core/BrandLogo.tsx \
       packages/ui/src/core/BrandLogo.css \
       packages/ui/src/core/BrandLogo.test.tsx \
       packages/ui/src/core/BrandLogo.card.html \
       packages/ui/src/core/BrandLogo.prompt.md \
       apps/storybook/src/core/BrandLogo.stories.tsx
```

- [ ] **Step 2: Drop the barrel exports**

In `packages/ui/src/index.ts`, delete these two lines (17–18):
```ts
export { BrandLogo, brandNames, brandColors } from './core/BrandLogo'
export type { BrandLogoProps, BrandName } from './core/BrandLogo'
```
Leave the `Icon` exports (lines 19–20) intact.

- [ ] **Step 3: Verify the contract holds**

Run: `pnpm validate`
Expected: `✓ Contract OK` — no "missing story" / "not exported from barrel" / dangling-reference errors.

- [ ] **Step 4: Verify no stale references remain**

Run: `git grep -n "BrandLogo\|brandNames\|BrandName\|from './core/BrandLogo'" -- packages apps`
Expected: no matches (empty output).

- [ ] **Step 5: Full UI test + typecheck**

Run: `pnpm --filter @connor-adams/designsystem test && pnpm --filter @connor-adams/designsystem typecheck`
Expected: all tests pass (BrandLogo test gone), no type errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(ui)!: remove BrandLogo; brand marks now ship via Icon"
```

---

### Task 4: Update docs, card, and Storybook

**Files:**
- Modify: `packages/ui/src/core/Icon.prompt.md`
- Modify: `packages/ui/src/core/Icon.card.html`
- Modify: `apps/storybook/src/core/Icon.stories.tsx`

**Interfaces:**
- Consumes: `Icon`, `iconNames`, the `brand` prop, `brand:` names (Task 2).

- [ ] **Step 1: Document `brand:` in the prompt sidecar**

In `packages/ui/src/core/Icon.prompt.md`, add a usage line to the code block (after line 7):
```jsx
<Icon name="brand:spotify" />          {/* brand mark, tintable like text */}
<Icon name="brand:visa" brand />       {/* official brand color */}
```
And append to the Props sentence: ` · \`brand\` (render a \`brand:\` glyph in its official color; no-op on stroke glyphs).` Then add a sentence at the end of the prose: `Brand/merchant marks (Spotify, Visa, PayPal…) are addressed with a \`brand:\` prefix and are included in \`iconNames\`; they render as filled glyphs.`

- [ ] **Step 2: Add a brand row to the card**

In `packages/ui/src/core/Icon.card.html`, insert this block between the "Inherits color & sizes" `</div>` (line 40) and the "Registry" `<div>` (line 41):
```jsx
        <div>
          <p className="cap">Brand marks</p>
          <div className="row">
            <Icon name="brand:spotify" size={28} brand />
            <Icon name="brand:visa" size={28} brand />
            <Icon name="brand:paypal" size={28} brand />
            <Icon name="brand:apple" size={28} />
          </div>
        </div>
```
(The Registry grid already maps `iconNames`, so brand glyphs appear there automatically in `currentColor`.)

- [ ] **Step 3: Add a brand showcase story**

In `apps/storybook/src/core/Icon.stories.tsx`, add `brand` to `argTypes` (after the `strokeWidth` control, line 11):
```tsx
    brand: { control: 'boolean' },
```
Then add this story after `InheritsColor` (after line 39):
```tsx
export const BrandMarks: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      <Icon name="brand:spotify" size={36} brand />
      <Icon name="brand:netflix" size={36} brand />
      <Icon name="brand:visa" size={36} brand />
      <Icon name="brand:paypal" size={36} brand />
      <Icon name="brand:cash-app" size={36} brand />
      <Icon name="brand:starbucks" size={36} brand />
    </div>
  ),
}
```

- [ ] **Step 4: Verify contract + build still green**

Run: `pnpm validate && pnpm --filter @connor-adams/designsystem typecheck`
Expected: contract OK, no type errors.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/core/Icon.prompt.md packages/ui/src/core/Icon.card.html apps/storybook/src/core/Icon.stories.tsx
git commit -m "docs(ui): document and showcase brand: glyphs on Icon"
```

---

### Task 5: Changeset + full verification

**Files:**
- Create: `.changeset/brandlogo-into-icon.md`

- [ ] **Step 1: Write the changeset (major)**

Create `.changeset/brandlogo-into-icon.md`:
```md
---
"@connor-adams/designsystem": major
---

Remove `BrandLogo`; brand/merchant marks now ship through `Icon`.

Brand logos are addressed with a `brand:` name prefix — `<Icon name="brand:spotify" />`, or `<Icon name="brand:visa" brand />` for the official color. The `brand` boolean moved onto `Icon` (no-op on stroke glyphs), and `iconNames` now includes the `brand:`-prefixed names.

**Breaking:** the `BrandLogo` component and the `brandNames`, `brandColors`, `BrandName`, and `BrandLogoProps` exports are removed. Migrate `<BrandLogo name="spotify" brand />` → `<Icon name="brand:spotify" brand />`.
```

- [ ] **Step 2: Full build + test + validate**

Run: `pnpm build && pnpm --filter @connor-adams/designsystem test && pnpm validate`
Expected: build succeeds (tsup emits, Storybook + web build clean), all tests pass, contract OK.

- [ ] **Step 3: Commit**

```bash
git add .changeset/brandlogo-into-icon.md
git commit -m "chore: changeset for BrandLogo removal (major)"
```

---

## Self-Review

- **Spec coverage:** namespaced `brand:` API (Task 2) ✓; `brand` boolean on Icon (Task 2) ✓; `iconNames` includes brand names (Task 2) ✓; removal of all five BrandLogo exports (Task 3) ✓; `brandGlyphs.ts` extraction (Task 1) ✓; render branch / filled path / data-brand (Task 2) ✓; delete 6 files (Task 3) ✓; update Icon css/test/card/prompt/stories — CSS needs no change per Global Constraints (justified), test (Task 2), card+prompt+stories (Task 4) ✓; changeset major (Task 5) ✓; verification via validate/test/typecheck/build (Tasks 3–5) ✓.
- **Placeholder scan:** the only `…` are explicit "copy verbatim from BrandLogo.tsx:<lines>" instructions for the ~530-line path data, with exact source line ranges — not vague TODOs.
- **Type consistency:** `BrandSlug`, `brandSlugs`, `brandColors`, `LOGOS` named identically across Tasks 1–2; `IconName`/`iconNames`/`IconProps.brand` consistent Task 2 → 4; `data-brand` slug (not prefixed name) asserted in Task 2 and produced by the Task 2 implementation.
