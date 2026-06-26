# @connor-adams/designsystem

## 1.0.0

### Major Changes

- 680bab8: Remove `BrandLogo`; brand/merchant marks now ship through `Icon`.

  Brand logos are addressed with a `brand:` name prefix — `<Icon name="brand:spotify" />`, or `<Icon name="brand:visa" brand />` for the official color. The `brand` boolean moved onto `Icon` (no-op on stroke glyphs), and `iconNames` now includes the `brand:`-prefixed names.

  **Breaking:** the `BrandLogo` component and the `brandNames`, `brandColors`, `BrandName`, and `BrandLogoProps` exports are removed. Migrate `<BrandLogo name="spotify" brand />` → `<Icon name="brand:spotify" brand />`. Brand marks now render with `data-slot="icon"` (was `data-slot="brand-logo"`) and the `.ca-icon` class (was `.ca-brand-logo`) — update any CSS/test selectors targeting the old values.

### Minor Changes

- 8c38e2e: Add an override seam for category icons so consumers can supply a stored "icon per category" instead of relying solely on keyword inference. `categoryVisual()` / `categoryIconName()` take an optional `overrides` map (category name → `IconName` or full `CategoryVisual`, matched case/punctuation-insensitively); a bare icon name swaps the glyph and keeps the inferred tint. `CategoryPill` gains `iconName` (render a registry glyph by name) and `overrides` props, and `CategoryBreakdown` gains a per-row `iconName` plus a tile-wide `iconOverrides`. Precedence: `icon` (raw node) › `iconName` › `overrides` › keyword inference.
- 69b6c52: CategoryPill now infers its icon and tint from free-text category/merchant names by keyword instead of an exact-match lookup over 8 fixed keys. Names like "Eating Out", "cc fees", "Vape", "Office Equipment", "Spotify", and "Amazon" now get sensible glyphs (brand names resolve ahead of generic words) rather than falling to a generic default. Exposes `categoryVisual()` and `categoryIconName()` for consumers that need the mapping directly, and exports the `GLYPHS` registry from the icon module.

### Patch Changes

- 0e7fbd5: Fix category-icon coverage gaps and the brand-mark path in `CategoryPill`:

  - The keyword matcher (`categoryVisual`/`categoryIconName`) wrote rules in the singular against word-boundary anchors, so naturally-plural and spaced names silently fell to the default `tag` glyph. Real misses now resolved: **Games** (`game` → `games?`), **Subscriptions** (`subscription` → `subscriptions?`), and **LuLu Lemon** (added a `lulu lemon` spaced alternative beside `lululemon`).
  - `CategoryPill` indexed the stroke-glyph `GLYPHS` registry with an `IconName` that now includes `brand:` marks, which both failed typecheck and would have rendered an empty glyph for a brand category icon. Brand names now render through `Icon` (filled mark in its official color); stroke glyphs keep their inline, tinted rendering.

## 0.11.0

### Minor Changes

- 4783bfc: Fill category-icon gaps: add Icon glyphs `tooth` (dentist), `lipstick` (makeup), and `vape` — previously falling back to stethoscope/sparkles/cloud. Also add the `yeti` BrandLogo. Tooth from Tabler Icons (MIT); lipstick & vape are bespoke stroke glyphs; yeti from Simple Icons (CC0).

## 0.10.0

### Minor Changes

- 6e2ac4c: Add 22 more BrandLogo brands (now ~251) recovered from older Simple Icons releases — including amazon, microsoft, adobe, slack, linkedin, xbox, nintendo, hulu, walmart, canva, openai, twilio, heroku, prime-video, edge, t-mobile, att, grubhub, flipkart, alibaba, gog, telekom. These were dropped from current Simple Icons over trademark requests; paths are still CC0 from the versions that shipped them.

## 0.9.0

### Minor Changes

- 85e7b0a: Expand BrandLogo registry from 34 to ~230 brands — broad coverage across payments/fintech, streaming, food & delivery, travel, retail, gaming, crypto, telecom, auto, and tech/SaaS (all from Simple Icons, CC0). Enumerate via `brandNames`; per-brand hexes in `brandColors`.

## 0.8.0

### Minor Changes

- 8915b55: Add BrandLogo component — filled brand/merchant logos (Spotify, Netflix, Visa, PayPal, Apple Pay, Cash App, and 28 more). Renders in currentColor by default or the official brand color via the `brand` prop; sized via `size`. Names exported as `brandNames`, official hexes as `brandColors`. Paths from Simple Icons (CC0).

## 0.7.0

### Minor Changes

- 531392e: Expand Icon registry (wave 8) — add 13 more glyphs: log-in, receipt-text, book-open-check, heart-handshake, heart-pulse, hand-coins, list-checks, clipboard-check, box, hammer, smartphone, building-2, tags.

## 0.6.0

### Minor Changes

- c1ccc83: Expand Icon registry (wave 7) — add the 13 CategoryIcon glyphs still on lucide: baby, bed, flower-2, gamepad-2, keyboard, mountain, paintbrush, parking-square, party-popper, plug, recycle, stethoscope, trees.

## 0.5.0

### Minor Changes

- 62ede3f: Expand Icon registry (wave 6) — close the lucide-react glyph gap blocking the cashflow frontend migration. Adds app utilities (sparkles, calendar-clock, calendar-range, calendar-plus, git-compare, git-merge, wrench, chevrons-up-down, grip-vertical, command, wand, filter-x, unlock, unlink, user-x), distinct shield/alert glyphs (shield-alert, shield-check, octagon-alert), and a merchant/category palette (pizza, beer, bike, bus, train, pill, sofa, shirt, gem, cake, paw-print, ticket, tv, wine, snowflake).

## 0.4.0

### Minor Changes

- ac552f2: Add Icon component — a registry of lucide-style stroke glyphs (money, categories, actions, status, chevrons) rendered in `currentColor` and sized via the `size` prop. Names exported as `iconNames`.
- ad0ad3f: Expand Icon registry — add ~34 more glyphs (arrows, bar-chart, calculator, percent, target, coffee, shopping-bag, fuel, dumbbell, book-open, music, phone, wifi, building, map-pin, menu, more-horizontal/vertical, star, bookmark, lock, log-out, refresh-cw, copy, external-link, mail, clock, tag, x-circle, help-circle).
- 32ac6f2: Expand Icon registry (wave 3) — add ~31 more glyphs: files (file, file-text, folder, clipboard, printer, save), media (play, pause, skip-forward, skip-back, volume, volume-x), devices (laptop, monitor, camera, image), weather (sun, moon, cloud), social (message-circle, send, thumbs-up, share, link), and goals/misc (trophy, award, scale, globe, power, sliders, flag).
- 96b9d91: Expand Icon registry (wave 4) — add ~29 more glyphs: commerce (package, truck, store, key), layout (grid, list, layout-dashboard, maximize, panel-left), editing (scissors, type, undo, redo, check-square, square, circle), people (users, user-plus, at-sign, video, mic), travel (compass, map, navigation), time (timer, hourglass), and misc (battery, smile, eye-off, thumbs-down, alert-circle).
- 7e5e604: Expand Icon registry (wave 5) — add ~30 more glyphs: finance (bitcoin, circle-dollar-sign, line-chart), comms (inbox, archive, reply, forward, message-square), data (database, server, hard-drive, paperclip), text/format (bold, italic, underline, align-left, hash, code, terminal), life (gauge, lightbulb, rocket, flame, leaf, droplet, umbrella), and status/nav (check-check, plus-circle, minus-circle, minimize).
- 3a56331: Styles now load automatically — `import { Button } from '@connor-adams/designsystem'` pulls in the bundled CSS (tokens included) via a side-effect import on the JS entry. The separate `import '@connor-adams/designsystem/styles.css'` line is no longer required (the export is kept for back-compat). Requires a consumer bundler that processes CSS from `node_modules`.

### Patch Changes

- c1ec281: Fix a total CSS load failure in Next.js consumers. The previous layer setup
  applied cascade layers through `@import "..." layer(base|components)` in
  `styles.css`. Next.js's CSS pipeline silently drops layered `@import`s, so the
  whole stylesheet — tokens and components — failed to load: pages rendered
  completely unstyled (serif fallback, no token variables).

  Layers are now baked into the files instead: the token base element resets live
  in `@layer base` (in `tokens/base.css`) and the bundled component CSS is wrapped
  in `@layer components` at build time (tsup `onSuccess`). `styles.css` uses plain
  `@import`, which both Next.js and Vite inline correctly. Cascade order is
  base < components < unlayered: components beat the base resets (e.g. the
  form-control `font: inherit`) while consumer styles still override components.

  Verified in both the Next web app and Storybook (Vite): CSS loads and a default
  Button computes `font-weight: 600`.

- e73f3ce: Ship component CSS in `@layer components` so consumer styles (Tailwind
  utilities or any unlayered rule) override a component's own styling via
  `className`. The earlier attempt at this was reverted because it layered the
  components but left the token base resets unlayered — so
  `button, input, select, textarea { font: inherit }` outranked the layered
  components and wiped out their `font-weight`/`font-size`. This version declares
  `@layer base, components` and imports the tokens into `layer(base)`, so the
  order is base < components < unlayered: components beat the base resets, and
  consumer styles still override components.
- Updated dependencies [c1ec281]
  - @connor-adams/tokens@0.1.1

## 0.3.1

### Patch Changes

- 8dc5f2d: Ship component CSS in `@layer components` (via the `styles.css` import) so a
  consumer's styles — Tailwind utilities (which sit in `@layer utilities`, after
  `components`) or any unlayered rule — override a component's own styling through
  `className`. Without the layer, the unlayered component classes won the cascade
  against consumer utilities.

## 0.3.0

### Minor Changes

- 30af5a0: Add CategoryBreakdown component — a card with a ranked horizontal-bar breakdown of money by category, composed from existing primitives.

## 0.2.0

### Minor Changes

- 1d5cd7b: Move all component interactive states (hover, focus-visible, active, disabled) from JS-driven inline styles into co-located CSS, keyed off `data-variant`/`data-size`. Every component now uses `React.forwardRef` and merges the consumer `className`. This adds visible keyboard focus rings across the library (WCAG 2.4.7), removes re-render-on-hover, and ships a single bundled `dist/index.css` (re-exported by `styles.css`).

  Also adds a vitest + Testing Library suite (one `*.test.tsx` per component, 350 tests) wired into CI.
