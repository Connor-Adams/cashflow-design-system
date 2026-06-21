# @connor-adams/designsystem

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
