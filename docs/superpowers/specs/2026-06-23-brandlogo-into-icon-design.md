# Fold `BrandLogo` into `Icon`

**Date:** 2026-06-23
**Status:** Approved design
**Scope:** `@connor-adams/designsystem` — `core` group. Breaking change (major version bump).

## Problem

The design system ships two sibling primitives in `packages/ui/src/core/`:

- `Icon` — stroke-based Lucide glyphs on a 24×24 grid, `currentColor`, decorative by default.
- `BrandLogo` — *filled* single-path brand/merchant marks (Simple Icons), optionally rendered in the brand's official color via a `brand` boolean.

Conceptually a brand logo is just another kind of icon. Maintaining a second component, second name union, and second set of skill sidecars for what callers experience as "render a small square glyph" is duplicative. A brand mark should be addressable through `Icon`.

## Decision

Fold brand logos into `Icon` as a **namespaced sub-registry**. Brand marks are addressed with a `brand:` name prefix:

```tsx
<Icon name="brand:spotify" />            // currentColor, theme-safe
<Icon name="brand:spotify" brand />      // official Spotify green
<Icon name="wallet" />                   // unchanged stroke glyph
```

`BrandLogo` and its public surface are **removed outright** (not deprecated). It has zero internal consumers in this repo (only re-exported from the barrel), so the in-repo cost is bounded; external consumers absorb the break under a major version bump.

### Rejected alternatives

- **Flat merged namespace** (`<Icon name="spotify" />`): name collisions (`apple` fruit-glyph vs Apple brand), and forces a per-glyph render-mode flag. Loses the type-level "is this a brand" signal.
- **Discriminator prop** (`<Icon kind="brand" name="spotify" />`): two parallel name unions, more verbose call site.
- **Deprecated re-export of `BrandLogo`**: leaves a dead alias to maintain; user chose a clean removal.

## API

```ts
// Icon.tsx
export type IconName = keyof typeof GLYPHS | `brand:${BrandSlug}`

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  name: IconName
  size?: number          // default 20
  strokeWidth?: number   // default 2 — ignored for brand glyphs (filled)
  brand?: boolean        // default false — official color; no-op on stroke glyphs
  title?: string         // accessible label; omitted ⇒ aria-hidden
}

/** All registered names, stroke glyphs then `brand:`-prefixed marks. */
export const iconNames: IconName[]
```

Removed from the public barrel (`packages/ui/src/index.ts`):
`BrandLogo`, `BrandLogoProps`, `BrandName`, `brandNames`, `brandColors`.

## Architecture

### `packages/ui/src/core/brandGlyphs.ts` (new, `.ts` not `.tsx`)

Holds the brand data extracted from the old `BrandLogo.tsx`:

```ts
export const LOGOS = { adidas: "m24 19.5…", … } satisfies Record<string, string>
export type BrandSlug = keyof typeof LOGOS
export const brandColors: Record<BrandSlug, string> = { … }
export const brandSlugs = Object.keys(LOGOS) as BrandSlug[]
```

Rationale: ~530 lines of path data would balloon `Icon.tsx` past 900 lines and bury the component logic. A `.ts` data module sits outside the component contract enforced by `validate.mjs` (which only scans `.tsx`), so it needs no barrel export or story.

### `Icon.tsx` render branch

```tsx
const isBrand = name.startsWith('brand:')
if (isBrand) {
  const slug = name.slice(6) as BrandSlug
  // <svg … data-icon={name} data-brand={slug} fill={brand ? brandColors[slug] : 'currentColor'} stroke="none">
  //   <path d={LOGOS[slug]} />
}
// else: existing stroke render (fill="none" stroke="currentColor"), unchanged
```

- `viewBox="0 0 24 24"` for both (already shared).
- Brand SVG: `fill` set, `stroke="none"`, no `strokeWidth`/`strokeLinecap`.
- Stroke SVG: unchanged from today.
- `data-icon={name}` carries the full prefixed name; `data-brand={slug}` present only for brand glyphs.
- `className` stays `ca-icon` for both. Any brand-specific styling from `BrandLogo.css` that's still needed is folded into `Icon.css`; `ca-brand-logo` class is retired.

### `iconNames`

```ts
export const iconNames = [
  ...Object.keys(GLYPHS),
  ...brandSlugs.map((s) => `brand:${s}`),
] as IconName[]
```

Galleries/pickers that enumerate `iconNames` now surface brand marks too. Intended.

## Files

**New**
- `packages/ui/src/core/brandGlyphs.ts`

**Delete**
- `packages/ui/src/core/BrandLogo.tsx`
- `packages/ui/src/core/BrandLogo.css`
- `packages/ui/src/core/BrandLogo.test.tsx`
- `packages/ui/src/core/BrandLogo.card.html`
- `packages/ui/src/core/BrandLogo.prompt.md`
- `apps/storybook/src/core/BrandLogo.stories.tsx`

**Modify**
- `packages/ui/src/core/Icon.tsx` — import brand data, extend `IconName`, brand render branch, extend `iconNames`.
- `packages/ui/src/core/Icon.css` — fold needed brand styles.
- `packages/ui/src/core/Icon.test.tsx` — add brand-glyph cases.
- `packages/ui/src/core/Icon.card.html` — document `brand:` usage + official-color toggle.
- `packages/ui/src/core/Icon.prompt.md` — document `brand:` usage.
- `packages/ui/src/index.ts` — drop the five BrandLogo exports.
- `apps/storybook/src/core/Icon.stories.tsx` — add a brand-marks showcase story.
- New changeset — `@connor-adams/designsystem` **major**, breaking-change note (BrandLogo removed; use `Icon name="brand:…"`).

## Testing

New cases in `Icon.test.tsx`:
- `<Icon name="brand:spotify" />` renders a filled `<path>`, `stroke="none"`, `data-brand="spotify"`.
- `brand` prop applies `brandColors[slug]` as `fill`; omitted ⇒ `fill="currentColor"`.
- `title` still drives `role="img"` + `aria-label`; omitted ⇒ `aria-hidden` (shared path, but assert for a brand name).
- A stroke glyph (`name="wallet"`) is unaffected: `fill="none"`, `stroke="currentColor"`.

## Verification

- `node scripts/validate.mjs` → green (Icon barreled + storied; BrandLogo fully gone, no dangling story/barrel ref).
- `pnpm test` (or repo equivalent) → Icon tests pass incl. new brand cases.
- Storybook build succeeds; Icon story shows both sets.
- Web/gallery build succeeds (consumes `iconNames`).

## Out of scope

- No change to the brand path data itself (same Simple Icons set).
- No new brand marks added.
- No taxonomy/IA work beyond what `iconNames` surfacing implies.
