# Media player components for `@connor-adams/designsystem`

**Date:** 2026-06-20
**Status:** Approved design, pending implementation plan

## Goal

Add a `media/` component category to the design system, porting the player
experience from the `rainbot` app UI. The *behavior and contracts* come from
rainbot; the *styling and structure* are rebuilt in DS idiom. None of
rainbot's CSS, Tailwind, or app wiring is carried over.

## Core principle: controlled & decoupled

Every component is **presentational and controlled**. The caller owns all
state and passes values in + callbacks out. The DS imports nothing from any
app: no data fetching, no `@tanstack/react-query`, no zustand stores, no
Discord/`guildId`, no source-sniffing, no YouTube thumbnail derivation. Those
were app concerns in rainbot's `NowPlayingCard`/`QueueList` and are explicitly
**out of scope** (see below).

## DS idiom (decoded from existing components)

- Named exports (`export function X`), props extend the relevant
  `React.HTMLAttributes`, `data-slot` attribute, JSDoc above the interface.
- **No Tailwind, no className utilities.** Styling is inline `style={{ … }}`
  with token CSS vars: `--primary --success --warning --destructive --muted
  --muted-foreground --foreground --background --border --card --font-sans
  --font-mono --text-body{,-sm,-lg} --text-label --weight-semibold --radius-*`.
- **Animations** are component-embedded keyframes:
  `<style>{'@keyframes cf-NAME{…}'}</style>` (cf. `Spinner` `cf-spin`,
  `Progress` `cf-prog`). Naming prefix `cf-`.
- **Icons** are inline SVG (no icon package).
- React 18-compatible (DS `peerDependencies: react >=18`). No React-19-only API.

## Components (`packages/ui/src/media/`)

### 1. `NowPlayingArtwork`
- Props: `{ isPlaying: boolean; thumbnailUrl?: string | null; alt?: string }`.
- Square artwork. When `thumbnailUrl` set and loads → `<img>`; else/on-error →
  gradient placeholder (inline SVG, `--primary`→`--accent`/`--primary` tint).
- When `isPlaying`, overlay an animated equalizer via embedded `cf-eq`
  keyframes (4 bars, staggered).
- Image-error state resets when `thumbnailUrl` changes.

### 2. `TrackInfo`
- Props: `{ title: string; source?: string; sourceLink?: string | null }`.
- Title (large, ellipsis-truncated) + source line (muted, ellipsis). When
  `sourceLink` set, render an external-link affordance (inline SVG, opens in
  new tab, `rel="noopener noreferrer"`).

### 3. `ProgressBar` (seekable scrubber)
- Props: `{ currentTime: number; duration: number; onSeek?: (positionSeconds: number) => void }`.
- Track + fill (solid `var(--primary)` — drops rainbot's gradient to match the
  existing `core/Progress`), hover handle, click-to-seek computing position
  from click X. Elapsed / total `m:ss` labels via internal `formatDuration`.
- **Distinct from `core/Progress`** (that is a determinate display bar with no
  seek interaction and no time labels). Do not overload it.

### 4. `PlaybackControls`
- Props: `{ isPaused: boolean; isLoading?: boolean; onPlayPause: () => void;
  onSkip: () => void; onPrevious?: () => void }`.
- Previous / play-pause / next. Inline SVG icons. Primary-tinted play/pause
  button; prev disabled when no `onPrevious`; all disabled while `isLoading`.

### 5. `MediaPlayer` (composed — replaces app-coupled `NowPlayingCard`)
- Props: `{ track: MediaTrack; currentTime: number; duration: number;
  isPaused: boolean; isLoading?: boolean; onPlayPause: () => void;
  onSkip: () => void; onPrevious?: () => void; onSeek?: (s: number) => void;
  autoTick?: boolean }`.
- Lays out `NowPlayingArtwork` + `TrackInfo` + `ProgressBar` +
  `PlaybackControls` in a card (`var(--card)`, `--border`, `--radius`),
  responsive column→row.
- `autoTick` (opt-in, default off): the one genuinely useful behavior salvaged
  from rainbot's `NowPlayingCard` — a local 1s interval that advances a
  displayed position smoothly between parent updates, clamped to `duration`,
  paused when `isPaused`, reset when the track identity changes. The displayed
  time is `currentTime` unless `autoTick` is on, in which case it's the local
  ticked value re-seeded whenever `currentTime`/track changes. No network, no
  query layer.

### 6. `QueueList`
- Props: `{ items: MediaTrack[]; nowPlaying?: MediaTrack | null;
  onRemove?: (index: number) => void; onClear?: () => void;
  emptyLabel?: string }`.
- Presentational list of upcoming tracks, count `Badge`, optional Clear
  `Button`, `EmptyState` when empty. Reuses existing DS primitives
  (`Card`, `Badge`, `Button`, `EmptyState`).
- **`QueueItem` is inlined** as a private sub-component inside `QueueList.tsx`
  (not a separate `.tsx`). Rationale: `validate.mjs` scans every `.tsx` in the
  category and would otherwise demand a separate story + barrel export for it;
  one validated unit is cleaner. (Alternative considered: first-class exported
  `QueueItem` with its own artifacts — rejected as more surface for no clear
  reuse win right now.)

## Shared modules (`.ts`, not `.tsx` — so not scanned as components)

- `media/types.ts` → `export interface MediaTrack { id?: string; title: string;
  source?: string; sourceLink?: string | null; thumbnailUrl?: string | null;
  duration?: number }`. Exported from the barrel.
- `media/format.ts` → internal `formatDuration(seconds: number): string`
  (`m:ss`, guards NaN/negative). Replaces rainbot's `@/lib/utils` dependency.
- `media/useAudioPreview.ts` → hook ported near-verbatim from rainbot
  (`HTMLAudioElement`-based preview with toggle/stop/cleanup). Already
  app-agnostic. Returns `{ previewingSound, playPreview, stopPreview }`.
  Exported from the barrel.

## Deliverables matrix

| Unit | `.tsx`/`.ts` | barrel export | story (FATAL) | `.prompt.md` | `.card.html` |
|---|---|---|---|---|---|
| NowPlayingArtwork | ✓ | ✓ | ✓ | ✓ | ✓ |
| TrackInfo | ✓ | ✓ | ✓ | ✓ | ✓ |
| ProgressBar | ✓ | ✓ | ✓ | ✓ | ✓ |
| PlaybackControls | ✓ | ✓ | ✓ | ✓ | ✓ |
| MediaPlayer | ✓ | ✓ | ✓ | ✓ | ✓ |
| QueueList | ✓ | ✓ | ✓ | ✓ | ✓ |
| MediaTrack (type) | `.ts` | ✓ | — | — | — |
| formatDuration | `.ts` | internal | — | — | — |
| useAudioPreview | `.ts` | ✓ | — | — | — |

- **Stories**: `apps/storybook/src/media/<Name>.stories.tsx`, CSF3, `title:
  'Media/<Name>'`, args + named `StoryObj` exports. Mandatory — `validate.mjs`
  fails the build without them.
- **`.prompt.md`**: short description + ```jsx usage examples + one line on prop
  semantics (matches existing sidecars).
- **`.card.html`**: standalone React-18-UMD + babel-standalone demo against
  `../../_ds_bundle.js` (global `window.CashflowDesignSystem_2cf89d`), header
  `<!-- @dsCard group="Media" viewport="WxH" name="…" subtitle="…" -->`.

## Build / validation wiring

1. **`scripts/validate.mjs`**: add `'media'` to the `CATEGORIES` array —
   without it the new folder is never validated.
2. **`packages/ui/src/index.ts`**: add the `media/` barrel exports (components,
   `MediaTrack` type, `useAudioPreview`).
3. Stories for all six components (FATAL gate).
4. `_ds_bundle.js` global is regenerated by the existing build so the
   `.card.html` demos resolve the new components.

## Out of scope (left in rainbot)

- Data fetching / `@tanstack/react-query` / `botApi` / `useGuildStore`.
- Discord specifics: `guildId`, SSE/poll resync, queue mutations to a server.
- Source detection (`getSourceInfo`) and YouTube thumbnail derivation
  (`YouTubeUrl.getThumbnailUrl`) — caller supplies `source`/`sourceLink`/
  `thumbnailUrl`.
- Soundboard, server selectors, and other rainbot tabs unrelated to playback.
- Backend voice utils (`audioResource`, `ttsPlayer`, `trackFetcher`) — Node /
  Discord, never DS material.

## Verification

- `pnpm validate` → contract OK (every component barrel-exported + storied;
  sidecar coverage 6/6).
- `pnpm --filter @connor-adams/designsystem typecheck` clean.
- `pnpm build` clean (tsup + bundle).
- `pnpm storybook` renders the `Media/*` stories.
- Each `.card.html` opens standalone and renders its demo.
