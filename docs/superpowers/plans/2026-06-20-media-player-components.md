# Media Player Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `media/` component category to `@connor-adams/designsystem` — six controlled player components plus a `MediaTrack` type and `useAudioPreview` hook — rebuilt from the rainbot app's player in DS idiom.

**Architecture:** Every component is presentational and controlled: props in, callbacks out, no data fetching or app state. Styling is inline `style={{}}` with token CSS vars; animations are component-embedded `@keyframes`; icons are inline SVG. Each component ships a Storybook story (hard gate), a `.prompt.md`, and a `.card.html`.

**Tech Stack:** React 18 (peer), TypeScript, tsup (build), Storybook (CSF3), `scripts/validate.mjs` (structural contract).

## Global Constraints

- React 18-compatible only. No React-19-only APIs. (`peerDependencies: react >=18`.)
- No Tailwind, no className utilities. Inline `style={{}}` with token CSS vars only.
- Named exports (`export function X`). Props extend the relevant `React.HTMLAttributes`. `data-slot` attribute on the root. JSDoc block above the interface.
- Animations: component-embedded `<style>{'@keyframes cf-NAME{…}'}</style>`, prefix `cf-`.
- Icons: inline SVG. No icon package.
- Verified available tokens (use only these): `--primary --primary-foreground --primary-hover --secondary --secondary-foreground --accent --accent-foreground --muted --muted-foreground --foreground --background --card --card-foreground --border --input --ring --destructive --destructive-foreground --success --warning --font-sans --font-mono --text-body --text-body-sm --text-body-lg --text-label --text-headline --weight-regular --weight-medium --weight-semibold --weight-bold --radius-sm --radius-md --radius-lg --radius-xl --radius-full --shadow --space-1..--space-8`. (Note: `--shadow` only — there is no `--shadow-lg`. Raw px spacing is idiomatic in this repo.)
- Every `.tsx` in `packages/ui/src/media/` MUST be barrel-exported from `src/index.ts` via a `'./media/Name'` path AND have a story at `apps/storybook/src/media/Name.stories.tsx`, or `pnpm validate` fails fatally.
- `.card.html` files use React 18 UMD + babel-standalone against `../../_ds_bundle.js` (global `window.CashflowDesignSystem_2cf89d`), header `<!-- @dsCard group="Media" viewport="WxH" name="…" subtitle="…" -->`.
- No test runner exists. Per-task verification = `pnpm --filter @connor-adams/designsystem typecheck` and `pnpm validate`. The red→green signal is the TypeScript compiler: a story importing a not-yet-exported component fails typecheck.
- Commits: no `Co-Authored-By` trailer. Connor is sole author.

---

## File Structure

```
packages/ui/src/media/
  types.ts                    # MediaTrack
  format.ts                   # formatDuration (internal)
  useAudioPreview.ts          # hook
  NowPlayingArtwork.tsx  + .prompt.md + .card.html
  TrackInfo.tsx          + .prompt.md + .card.html
  ProgressBar.tsx        + .prompt.md + .card.html
  PlaybackControls.tsx   + .prompt.md + .card.html
  MediaPlayer.tsx        + .prompt.md + .card.html
  QueueList.tsx          + .prompt.md + .card.html   (QueueItem inlined)
packages/ui/src/index.ts      # barrel — add media exports
scripts/validate.mjs          # add 'media' to CATEGORIES
apps/storybook/src/media/
  NowPlayingArtwork.stories.tsx
  TrackInfo.stories.tsx
  ProgressBar.stories.tsx
  PlaybackControls.stories.tsx
  MediaPlayer.stories.tsx
  QueueList.stories.tsx
```

---

## Task 1: Foundation — category, types, format helper

**Files:**
- Modify: `scripts/validate.mjs` (CATEGORIES array)
- Create: `packages/ui/src/media/types.ts`
- Create: `packages/ui/src/media/format.ts`
- Modify: `packages/ui/src/index.ts` (add `MediaTrack` export)

**Interfaces:**
- Produces: `interface MediaTrack { id?: string; title: string; source?: string; sourceLink?: string | null; thumbnailUrl?: string | null; duration?: number }`
- Produces: `formatDuration(seconds: number): string` — `"m:ss"`, guards NaN/negative to `"0:00"`.

- [ ] **Step 1: Add `'media'` to validate CATEGORIES**

In `scripts/validate.mjs`, change:
```js
const CATEGORIES = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']
```
to:
```js
const CATEGORIES = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays', 'media']
```

- [ ] **Step 2: Create the type module**

`packages/ui/src/media/types.ts`:
```ts
/**
 * A track in the media player. All fields beyond `title` are optional so the
 * type fits queue rows, now-playing, and previews alike. The DS never derives
 * `source`/`thumbnailUrl` — the caller supplies them.
 */
export interface MediaTrack {
  id?: string
  title: string
  source?: string
  sourceLink?: string | null
  thumbnailUrl?: string | null
  /** Track length in seconds. */
  duration?: number
}
```

- [ ] **Step 3: Create the format helper**

`packages/ui/src/media/format.ts`:
```ts
/**
 * Format a number of seconds as `m:ss` (e.g. 75 → "1:15"). Non-finite or
 * negative input clamps to "0:00". Internal to the media category.
 */
export function formatDuration(seconds: number): string {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
  const m = Math.floor(total / 60)
  const r = total % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}
```

- [ ] **Step 4: Sanity-check formatDuration (pure logic)**

Run:
```bash
cd "packages/ui" && node --input-type=module -e "import('./src/media/format.ts').catch(()=>{}); const f=(s)=>{const t=Number.isFinite(s)&&s>0?Math.floor(s):0;return Math.floor(t/60)+':'+(t%60).toString().padStart(2,'0')}; console.log(f(0),f(5),f(75),f(3661),f(-3),f(NaN))"
```
Expected output: `0:00 0:05 1:15 61:01 0:00 0:00`

- [ ] **Step 5: Export the type from the barrel**

Append to `packages/ui/src/index.ts`:
```ts
export type { MediaTrack } from './media/types'
```

- [ ] **Step 6: Typecheck + validate**

Run:
```bash
cd "$(git rev-parse --show-toplevel)" && pnpm --filter @connor-adams/designsystem typecheck && pnpm validate
```
Expected: typecheck clean; validate prints `✓ Contract OK` (the empty `media/` dir adds no components yet).

- [ ] **Step 7: Commit**

```bash
git add scripts/validate.mjs packages/ui/src/media/types.ts packages/ui/src/media/format.ts packages/ui/src/index.ts
git commit -m "feat(ui): add media category foundation — MediaTrack type, formatDuration, validate wiring"
```

---

## Task 2: NowPlayingArtwork

**Files:**
- Create: `packages/ui/src/media/NowPlayingArtwork.tsx`
- Create: `apps/storybook/src/media/NowPlayingArtwork.stories.tsx`
- Create: `packages/ui/src/media/NowPlayingArtwork.prompt.md`
- Create: `packages/ui/src/media/NowPlayingArtwork.card.html`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `NowPlayingArtwork(props: NowPlayingArtworkProps)`, `interface NowPlayingArtworkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> { isPlaying: boolean; thumbnailUrl?: string | null; alt?: string }`

- [ ] **Step 1: Write the story (the failing gate)**

`apps/storybook/src/media/NowPlayingArtwork.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { NowPlayingArtwork } from '@connor-adams/designsystem'

const meta: Meta<typeof NowPlayingArtwork> = {
  title: 'Media/NowPlayingArtwork',
  component: NowPlayingArtwork,
  args: { isPlaying: true, thumbnailUrl: null },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof NowPlayingArtwork>

export const Placeholder: Story = { args: { thumbnailUrl: null, isPlaying: true } }
export const Paused: Story = { args: { thumbnailUrl: null, isPlaying: false } }
export const WithThumbnail: Story = {
  args: { isPlaying: true, thumbnailUrl: 'https://picsum.photos/seed/cf-art/280/280' },
}
```

- [ ] **Step 2: Run typecheck — verify it fails**

Run: `pnpm --filter @connor-adams/designsystem typecheck`
Expected: FAIL — `Module '"@connor-adams/designsystem"' has no exported member 'NowPlayingArtwork'`.

- [ ] **Step 3: Implement the component**

`packages/ui/src/media/NowPlayingArtwork.tsx`:
```tsx
import * as React from 'react'

/**
 * Square track artwork for the now-playing surface. When `thumbnailUrl` is set
 * and loads, shows the image; otherwise (or on load error) shows a token
 * gradient placeholder with a play glyph. While `isPlaying`, an animated
 * equalizer badge pulses in the corner.
 */
export interface NowPlayingArtworkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  isPlaying: boolean
  thumbnailUrl?: string | null
  alt?: string
}

const BARS = [0, 1, 2, 3]

export function NowPlayingArtwork({ isPlaying, thumbnailUrl, alt = '', className, style, ...props }: NowPlayingArtworkProps): React.JSX.Element {
  const [imageError, setImageError] = React.useState(false)
  React.useEffect(() => { setImageError(false) }, [thumbnailUrl])
  const showThumbnail = Boolean(thumbnailUrl) && !imageError

  return (
    <div
      data-slot="now-playing-artwork"
      className={className}
      style={{ position: 'relative', width: '100%', maxWidth: 280, aspectRatio: '1 / 1', flexShrink: 0, borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--muted)', boxShadow: 'var(--shadow)', ...style }}
      {...props}
    >
      {showThumbnail ? (
        <img src={thumbnailUrl ?? undefined} alt={alt} onError={() => setImageError(true)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <svg viewBox="0 0 280 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
          <defs>
            <linearGradient id="cf-art-grad" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <rect width="280" height="280" fill="url(#cf-art-grad)" />
          <path d="M110 80L190 140L110 200V80Z" fill="var(--primary-foreground)" opacity="0.9" />
        </svg>
      )}
      {isPlaying && (
        <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', alignItems: 'flex-end', gap: 3, height: 22, padding: '6px 8px', borderRadius: 'var(--radius-md)', background: 'color-mix(in oklch, var(--background) 55%, transparent)', backdropFilter: 'blur(4px)' }}>
          {BARS.map((i) => (
            <span key={i} style={{ width: 3, height: '100%', borderRadius: 2, background: 'var(--primary)', transformOrigin: 'bottom', animation: `cf-eq 0.9s ease-in-out ${i * 0.15}s infinite` }} />
          ))}
          <style>{'@keyframes cf-eq{0%,100%{transform:scaleY(0.35)}50%{transform:scaleY(1)}}'}</style>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Add the barrel export**

Append to `packages/ui/src/index.ts`:
```ts
export { NowPlayingArtwork } from './media/NowPlayingArtwork'
export type { NowPlayingArtworkProps } from './media/NowPlayingArtwork'
```

- [ ] **Step 5: Typecheck + validate — verify pass**

Run: `pnpm --filter @connor-adams/designsystem typecheck && pnpm validate`
Expected: typecheck clean; validate `✓ Contract OK`.

- [ ] **Step 6: Write the sidecars**

`packages/ui/src/media/NowPlayingArtwork.prompt.md`:
```markdown
Square artwork for the now-playing surface, with a gradient placeholder and a playing equalizer.

```jsx
<NowPlayingArtwork isPlaying thumbnailUrl="https://…/cover.jpg" />
<NowPlayingArtwork isPlaying={false} thumbnailUrl={null} />
```

Falls back to a token gradient + play glyph when `thumbnailUrl` is missing or fails to load. The equalizer badge animates only while `isPlaying`.
```

`packages/ui/src/media/NowPlayingArtwork.card.html`:
```html
<!-- @dsCard group="Media" viewport="640x320" name="NowPlayingArtwork" subtitle="Cover art with gradient fallback and playing equalizer" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../../styles.css" />
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
<script src="../../_ds_bundle.js"></script>
<style>
  body { margin: 0; padding: 20px; background: var(--card); font-family: var(--font-sans); }
  .grid { display: grid; grid-template-columns: repeat(2, 240px); gap: 20px; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
  const { NowPlayingArtwork } = window.CashflowDesignSystem_2cf89d;
  function Demo() {
    return (
      <div className="grid">
        <NowPlayingArtwork isPlaying thumbnailUrl="https://picsum.photos/seed/cf-art/280/280" />
        <NowPlayingArtwork isPlaying={false} thumbnailUrl={null} />
      </div>
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<Demo />);
</script>
</body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/media/NowPlayingArtwork.tsx packages/ui/src/media/NowPlayingArtwork.prompt.md packages/ui/src/media/NowPlayingArtwork.card.html apps/storybook/src/media/NowPlayingArtwork.stories.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add NowPlayingArtwork media component"
```

---

## Task 3: TrackInfo

**Files:**
- Create: `packages/ui/src/media/TrackInfo.tsx`
- Create: `apps/storybook/src/media/TrackInfo.stories.tsx`
- Create: `packages/ui/src/media/TrackInfo.prompt.md`
- Create: `packages/ui/src/media/TrackInfo.card.html`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `TrackInfo(props: TrackInfoProps)`, `interface TrackInfoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> { title: string; source?: string; sourceLink?: string | null }`

- [ ] **Step 1: Write the story**

`apps/storybook/src/media/TrackInfo.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { TrackInfo } from '@connor-adams/designsystem'

const meta: Meta<typeof TrackInfo> = {
  title: 'Media/TrackInfo',
  component: TrackInfo,
  args: { title: 'Midnight City', source: 'YouTube', sourceLink: 'https://youtu.be/dX3k_QDnzHE' },
}
export default meta

type Story = StoryObj<typeof TrackInfo>

export const Default: Story = {}
export const NoLink: Story = { args: { title: 'Local Sound — airhorn.mp3', source: 'Local Sound', sourceLink: null } }
export const LongTitle: Story = { args: { title: 'A Very Long Track Title That Should Truncate With An Ellipsis When It Overflows', source: 'SoundCloud', sourceLink: 'https://soundcloud.com/x' } }
```

- [ ] **Step 2: Run typecheck — verify it fails**

Run: `pnpm --filter @connor-adams/designsystem typecheck`
Expected: FAIL — no exported member `TrackInfo`.

- [ ] **Step 3: Implement the component**

`packages/ui/src/media/TrackInfo.tsx`:
```tsx
import * as React from 'react'

/**
 * Now-playing track title + source line, with an optional external link to the
 * source. Title and source ellipsis-truncate on overflow.
 */
export interface TrackInfoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string
  source?: string
  sourceLink?: string | null
}

const ellipsis: React.CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

export function TrackInfo({ title, source, sourceLink, className, style, ...props }: TrackInfoProps): React.JSX.Element {
  return (
    <div data-slot="track-info" className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, fontFamily: 'var(--font-sans)', ...style }} {...props}>
      <h2 title={title} style={{ margin: 0, fontSize: 'var(--text-headline)', fontWeight: 'var(--weight-bold)' as React.CSSProperties['fontWeight'], color: 'var(--foreground)', ...ellipsis }}>{title}</h2>
      {source && <p title={source} style={{ margin: 0, fontSize: 'var(--text-body-lg)', fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'], color: 'var(--muted-foreground)', ...ellipsis }}>{source}</p>}
      {sourceLink && (
        <a href={sourceLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content', marginTop: 2, padding: '6px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'], color: 'var(--primary)', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg>
          <span>Open in source</span>
        </a>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Add the barrel export**

Append to `packages/ui/src/index.ts`:
```ts
export { TrackInfo } from './media/TrackInfo'
export type { TrackInfoProps } from './media/TrackInfo'
```

- [ ] **Step 5: Typecheck + validate — verify pass**

Run: `pnpm --filter @connor-adams/designsystem typecheck && pnpm validate`
Expected: clean; `✓ Contract OK`.

- [ ] **Step 6: Write the sidecars**

`packages/ui/src/media/TrackInfo.prompt.md`:
```markdown
Now-playing title, source label, and an optional link out to the source.

```jsx
<TrackInfo title="Midnight City" source="YouTube" sourceLink="https://youtu.be/…" />
<TrackInfo title="airhorn.mp3" source="Local Sound" sourceLink={null} />
```

Title and source truncate with an ellipsis. The link renders only when `sourceLink` is set and opens in a new tab.
```

`packages/ui/src/media/TrackInfo.card.html`:
```html
<!-- @dsCard group="Media" viewport="560x220" name="TrackInfo" subtitle="Title, source, and optional source link" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../../styles.css" />
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
<script src="../../_ds_bundle.js"></script>
<style>
  body { margin: 0; padding: 20px; background: var(--card); font-family: var(--font-sans); }
  .wrap { display: flex; flex-direction: column; gap: 18px; max-width: 360px; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
  const { TrackInfo } = window.CashflowDesignSystem_2cf89d;
  function Demo() {
    return (
      <div className="wrap">
        <TrackInfo title="Midnight City" source="YouTube" sourceLink="https://youtu.be/dX3k_QDnzHE" />
        <TrackInfo title="airhorn.mp3" source="Local Sound" sourceLink={null} />
      </div>
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<Demo />);
</script>
</body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/media/TrackInfo.tsx packages/ui/src/media/TrackInfo.prompt.md packages/ui/src/media/TrackInfo.card.html apps/storybook/src/media/TrackInfo.stories.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add TrackInfo media component"
```

---

## Task 4: ProgressBar

**Files:**
- Create: `packages/ui/src/media/ProgressBar.tsx`
- Create: `apps/storybook/src/media/ProgressBar.stories.tsx`
- Create: `packages/ui/src/media/ProgressBar.prompt.md`
- Create: `packages/ui/src/media/ProgressBar.card.html`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `formatDuration` from `./format`.
- Produces: `ProgressBar(props: ProgressBarProps)`, `interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> { currentTime: number; duration: number; onSeek?: (positionSeconds: number) => void }`

- [ ] **Step 1: Write the story**

`apps/storybook/src/media/ProgressBar.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from '@connor-adams/designsystem'

const meta: Meta<typeof ProgressBar> = {
  title: 'Media/ProgressBar',
  component: ProgressBar,
  args: { currentTime: 75, duration: 214, onSeek: (s: number) => console.log('seek', s) },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {}
export const Start: Story = { args: { currentTime: 0, duration: 214 } }
export const NoDuration: Story = { args: { currentTime: 0, duration: 0 } }
```

- [ ] **Step 2: Run typecheck — verify it fails**

Run: `pnpm --filter @connor-adams/designsystem typecheck`
Expected: FAIL — no exported member `ProgressBar`.

- [ ] **Step 3: Implement the component**

`packages/ui/src/media/ProgressBar.tsx`:
```tsx
import * as React from 'react'
import { formatDuration } from './format'

/**
 * Seekable playback scrubber with elapsed / total time labels. Click anywhere
 * on the track to seek; `onSeek` receives the target position in whole
 * seconds. Distinct from `Progress`, which is a non-interactive display bar.
 */
export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  currentTime: number
  duration: number
  onSeek?: (positionSeconds: number) => void
}

export function ProgressBar({ currentTime, duration, onSeek, className, style, ...props }: ProgressBarProps): React.JSX.Element {
  const pct = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0
  const seekable = Boolean(onSeek) && duration > 0
  const [hover, setHover] = React.useState(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekable) return
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onSeek!(Math.floor(fraction * duration))
  }

  return (
    <div data-slot="progress-bar" className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', fontFamily: 'var(--font-sans)', ...style }} {...props}>
      <div
        role={seekable ? 'slider' : 'progressbar'}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ position: 'relative', width: '100%', height: 8, borderRadius: 'var(--radius-full)', background: 'var(--muted)', overflow: 'visible', cursor: seekable ? 'pointer' : 'default' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, borderRadius: 'var(--radius-full)', background: 'var(--primary)', transition: 'width 120ms linear' }} />
        {seekable && (
          <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, width: 14, height: 14, transform: 'translate(-50%, -50%)', borderRadius: 'var(--radius-full)', background: 'var(--foreground)', boxShadow: 'var(--shadow)', opacity: hover ? 1 : 0, transition: 'opacity 160ms ease' }} />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
        <span>{formatDuration(currentTime)}</span>
        <span>{formatDuration(duration)}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Add the barrel export**

Append to `packages/ui/src/index.ts`:
```ts
export { ProgressBar } from './media/ProgressBar'
export type { ProgressBarProps } from './media/ProgressBar'
```

- [ ] **Step 5: Typecheck + validate — verify pass**

Run: `pnpm --filter @connor-adams/designsystem typecheck && pnpm validate`
Expected: clean; `✓ Contract OK`.

- [ ] **Step 6: Write the sidecars**

`packages/ui/src/media/ProgressBar.prompt.md`:
```markdown
Seekable playback scrubber with elapsed / total time. Click to seek.

```jsx
<ProgressBar currentTime={75} duration={214} onSeek={(s) => player.seek(s)} />
<ProgressBar currentTime={0} duration={0} />
```

`onSeek` receives whole seconds. Omit it (or pass `duration={0}`) for a read-only bar. For a non-media determinate bar, use `Progress` instead.
```

`packages/ui/src/media/ProgressBar.card.html`:
```html
<!-- @dsCard group="Media" viewport="560x160" name="ProgressBar" subtitle="Seekable scrubber with time labels" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../../styles.css" />
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
<script src="../../_ds_bundle.js"></script>
<style>
  body { margin: 0; padding: 20px; background: var(--card); font-family: var(--font-sans); }
  .wrap { max-width: 420px; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
  const { ProgressBar } = window.CashflowDesignSystem_2cf89d;
  const { useState } = React;
  function Demo() {
    const [t, setT] = useState(75);
    return <div className="wrap"><ProgressBar currentTime={t} duration={214} onSeek={setT} /></div>;
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<Demo />);
</script>
</body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/media/ProgressBar.tsx packages/ui/src/media/ProgressBar.prompt.md packages/ui/src/media/ProgressBar.card.html apps/storybook/src/media/ProgressBar.stories.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add ProgressBar media scrubber component"
```

---

## Task 5: PlaybackControls

**Files:**
- Create: `packages/ui/src/media/PlaybackControls.tsx`
- Create: `apps/storybook/src/media/PlaybackControls.stories.tsx`
- Create: `packages/ui/src/media/PlaybackControls.prompt.md`
- Create: `packages/ui/src/media/PlaybackControls.card.html`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `PlaybackControls(props: PlaybackControlsProps)`, `interface PlaybackControlsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onPlay'> { isPaused: boolean; isLoading?: boolean; onPlayPause: () => void; onSkip: () => void; onPrevious?: () => void }`

- [ ] **Step 1: Write the story**

`apps/storybook/src/media/PlaybackControls.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { PlaybackControls } from '@connor-adams/designsystem'

const noop = () => {}
const meta: Meta<typeof PlaybackControls> = {
  title: 'Media/PlaybackControls',
  component: PlaybackControls,
  args: { isPaused: false, isLoading: false, onPlayPause: noop, onSkip: noop, onPrevious: noop },
}
export default meta

type Story = StoryObj<typeof PlaybackControls>

export const Playing: Story = {}
export const Paused: Story = { args: { isPaused: true } }
export const Loading: Story = { args: { isLoading: true } }
export const NoPrevious: Story = { args: { onPrevious: undefined } }
```

- [ ] **Step 2: Run typecheck — verify it fails**

Run: `pnpm --filter @connor-adams/designsystem typecheck`
Expected: FAIL — no exported member `PlaybackControls`.

- [ ] **Step 3: Implement the component**

`packages/ui/src/media/PlaybackControls.tsx`:
```tsx
import * as React from 'react'

/**
 * Previous / play-pause / next transport buttons. The play-pause button is
 * primary-tinted; previous is disabled when `onPrevious` is omitted; all
 * buttons disable while `isLoading`.
 */
export interface PlaybackControlsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onPlay'> {
  isPaused: boolean
  isLoading?: boolean
  onPlayPause: () => void
  onSkip: () => void
  onPrevious?: () => void
}

function iconButton(primary: boolean, disabled: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: primary ? 56 : 44, height: primary ? 56 : 44,
    border: primary ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-full)',
    background: primary ? 'var(--primary)' : 'transparent',
    color: primary ? 'var(--primary-foreground)' : 'var(--foreground)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background 140ms ease, opacity 140ms ease',
  }
}

export function PlaybackControls({ isPaused, isLoading = false, onPlayPause, onSkip, onPrevious, className, style, ...props }: PlaybackControlsProps): React.JSX.Element {
  return (
    <div data-slot="playback-controls" className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, ...style }} {...props}>
      <button type="button" title="Previous" aria-label="Previous" onClick={onPrevious} disabled={!onPrevious || isLoading} style={iconButton(false, !onPrevious || isLoading)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 6h2v12H6zM20 6v12L9 12z" /></svg>
      </button>
      <button type="button" title={isPaused ? 'Play' : 'Pause'} aria-label={isPaused ? 'Play' : 'Pause'} onClick={onPlayPause} disabled={isLoading} style={iconButton(true, isLoading)}>
        {isPaused
          ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          : <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>}
      </button>
      <button type="button" title="Next" aria-label="Next" onClick={onSkip} disabled={isLoading} style={iconButton(false, isLoading)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 6h2v12h-2zM4 6l11 6L4 18z" /></svg>
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Add the barrel export**

Append to `packages/ui/src/index.ts`:
```ts
export { PlaybackControls } from './media/PlaybackControls'
export type { PlaybackControlsProps } from './media/PlaybackControls'
```

- [ ] **Step 5: Typecheck + validate — verify pass**

Run: `pnpm --filter @connor-adams/designsystem typecheck && pnpm validate`
Expected: clean; `✓ Contract OK`.

- [ ] **Step 6: Write the sidecars**

`packages/ui/src/media/PlaybackControls.prompt.md`:
```markdown
Previous / play-pause / next transport buttons.

```jsx
<PlaybackControls isPaused={false} onPlayPause={toggle} onSkip={next} onPrevious={prev} />
<PlaybackControls isPaused isLoading onPlayPause={toggle} onSkip={next} />
```

The play-pause button is primary-tinted. Omit `onPrevious` to disable the previous button. `isLoading` disables every button.
```

`packages/ui/src/media/PlaybackControls.card.html`:
```html
<!-- @dsCard group="Media" viewport="560x160" name="PlaybackControls" subtitle="Previous / play-pause / next transport" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../../styles.css" />
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
<script src="../../_ds_bundle.js"></script>
<style>
  body { margin: 0; padding: 24px; background: var(--card); font-family: var(--font-sans); }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
  const { PlaybackControls } = window.CashflowDesignSystem_2cf89d;
  const { useState } = React;
  function Demo() {
    const [paused, setPaused] = useState(false);
    return <PlaybackControls isPaused={paused} onPlayPause={() => setPaused((p) => !p)} onSkip={() => {}} onPrevious={() => {}} />;
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<Demo />);
</script>
</body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/media/PlaybackControls.tsx packages/ui/src/media/PlaybackControls.prompt.md packages/ui/src/media/PlaybackControls.card.html apps/storybook/src/media/PlaybackControls.stories.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add PlaybackControls media component"
```

---

## Task 6: MediaPlayer (composed)

**Files:**
- Create: `packages/ui/src/media/MediaPlayer.tsx`
- Create: `apps/storybook/src/media/MediaPlayer.stories.tsx`
- Create: `packages/ui/src/media/MediaPlayer.prompt.md`
- Create: `packages/ui/src/media/MediaPlayer.card.html`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `NowPlayingArtwork`, `TrackInfo`, `ProgressBar`, `PlaybackControls` (relative imports), `MediaTrack` from `./types`.
- Produces: `MediaPlayer(props: MediaPlayerProps)`, `interface MediaPlayerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onPlay'> { track: MediaTrack; currentTime: number; duration: number; isPaused: boolean; isLoading?: boolean; onPlayPause: () => void; onSkip: () => void; onPrevious?: () => void; onSeek?: (positionSeconds: number) => void; autoTick?: boolean }`

- [ ] **Step 1: Write the story**

`apps/storybook/src/media/MediaPlayer.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MediaPlayer } from '@connor-adams/designsystem'

const noop = () => {}
const meta: Meta<typeof MediaPlayer> = {
  title: 'Media/MediaPlayer',
  component: MediaPlayer,
  args: {
    track: { title: 'Midnight City', source: 'YouTube', sourceLink: 'https://youtu.be/dX3k_QDnzHE', thumbnailUrl: 'https://picsum.photos/seed/cf-mp/280/280', duration: 244 },
    currentTime: 96, duration: 244, isPaused: false, isLoading: false,
    onPlayPause: noop, onSkip: noop, onPrevious: noop, onSeek: noop,
  },
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof MediaPlayer>

export const Default: Story = {}
export const Paused: Story = { args: { isPaused: true } }
export const Placeholder: Story = { args: { track: { title: 'No track playing', source: undefined, thumbnailUrl: null }, currentTime: 0, duration: 0 } }
```

- [ ] **Step 2: Run typecheck — verify it fails**

Run: `pnpm --filter @connor-adams/designsystem typecheck`
Expected: FAIL — no exported member `MediaPlayer`.

- [ ] **Step 3: Implement the component**

`packages/ui/src/media/MediaPlayer.tsx`:
```tsx
import * as React from 'react'
import type { MediaTrack } from './types'
import { NowPlayingArtwork } from './NowPlayingArtwork'
import { TrackInfo } from './TrackInfo'
import { ProgressBar } from './ProgressBar'
import { PlaybackControls } from './PlaybackControls'

/**
 * Composed now-playing player: artwork + track info + seekable scrubber +
 * transport, in a card. Fully controlled — the caller owns playback state and
 * passes callbacks. With `autoTick`, the displayed position advances locally
 * once per second between parent updates (re-seeded whenever `currentTime` or
 * the track identity changes), giving smooth motion without a network tick.
 */
export interface MediaPlayerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onPlay'> {
  track: MediaTrack
  currentTime: number
  duration: number
  isPaused: boolean
  isLoading?: boolean
  onPlayPause: () => void
  onSkip: () => void
  onPrevious?: () => void
  onSeek?: (positionSeconds: number) => void
  autoTick?: boolean
}

export function MediaPlayer({ track, currentTime, duration, isPaused, isLoading, onPlayPause, onSkip, onPrevious, onSeek, autoTick = false, className, style, ...props }: MediaPlayerProps): React.JSX.Element {
  const trackKey = `${track.id ?? ''}|${track.title}|${duration}`
  const [ticked, setTicked] = React.useState(currentTime)

  // Re-seed the local clock when the parent position or the track changes.
  React.useEffect(() => { setTicked(currentTime) }, [currentTime, trackKey])

  // Advance locally once per second while playing (opt-in via autoTick).
  React.useEffect(() => {
    if (!autoTick || isPaused || duration <= 0) return
    const interval = setInterval(() => {
      setTicked((prev) => (prev >= duration ? duration : prev + 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [autoTick, isPaused, duration, trackKey])

  const shown = autoTick ? ticked : currentTime

  return (
    <section
      data-slot="media-player"
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--card-foreground)', ...style }}
      {...props}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 auto', width: 'min(240px, 100%)' }}>
          <NowPlayingArtwork isPlaying={!isPaused} thumbnailUrl={track.thumbnailUrl} alt={track.title} />
        </div>
        <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TrackInfo title={track.title} source={track.source} sourceLink={track.sourceLink} />
          <ProgressBar currentTime={shown} duration={duration} onSeek={onSeek} />
          <PlaybackControls isPaused={isPaused} isLoading={isLoading} onPlayPause={onPlayPause} onSkip={onSkip} onPrevious={onPrevious} />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Add the barrel export**

Append to `packages/ui/src/index.ts`:
```ts
export { MediaPlayer } from './media/MediaPlayer'
export type { MediaPlayerProps } from './media/MediaPlayer'
```

- [ ] **Step 5: Typecheck + validate — verify pass**

Run: `pnpm --filter @connor-adams/designsystem typecheck && pnpm validate`
Expected: clean; `✓ Contract OK`.

- [ ] **Step 6: Write the sidecars**

`packages/ui/src/media/MediaPlayer.prompt.md`:
```markdown
Composed now-playing player — artwork, track info, seekable scrubber, transport — in a card. Fully controlled.

```jsx
<MediaPlayer
  track={{ title: 'Midnight City', source: 'YouTube', sourceLink: url, thumbnailUrl: cover, duration: 244 }}
  currentTime={96} duration={244} isPaused={false}
  onPlayPause={toggle} onSkip={next} onSeek={seek} autoTick
/>
```

Pass `autoTick` to advance the displayed position locally between parent updates. Omit `onSeek` for a read-only scrubber.
```

`packages/ui/src/media/MediaPlayer.card.html`:
```html
<!-- @dsCard group="Media" viewport="760x360" name="MediaPlayer" subtitle="Composed now-playing — artwork, info, scrubber, transport" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../../styles.css" />
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
<script src="../../_ds_bundle.js"></script>
<style>
  body { margin: 0; padding: 20px; background: var(--card); font-family: var(--font-sans); }
  .wrap { max-width: 720px; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
  const { MediaPlayer } = window.CashflowDesignSystem_2cf89d;
  const { useState } = React;
  function Demo() {
    const [paused, setPaused] = useState(false);
    const [t, setT] = useState(96);
    const track = { title: 'Midnight City', source: 'YouTube', sourceLink: 'https://youtu.be/dX3k_QDnzHE', thumbnailUrl: 'https://picsum.photos/seed/cf-mp/280/280', duration: 244 };
    return (
      <div className="wrap">
        <MediaPlayer track={track} currentTime={t} duration={244} isPaused={paused}
          onPlayPause={() => setPaused((p) => !p)} onSkip={() => {}} onPrevious={() => {}} onSeek={setT} autoTick={!paused} />
      </div>
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<Demo />);
</script>
</body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/media/MediaPlayer.tsx packages/ui/src/media/MediaPlayer.prompt.md packages/ui/src/media/MediaPlayer.card.html apps/storybook/src/media/MediaPlayer.stories.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add composed MediaPlayer component"
```

---

## Task 7: QueueList (with inlined QueueItem)

**Files:**
- Create: `packages/ui/src/media/QueueList.tsx`
- Create: `apps/storybook/src/media/QueueList.stories.tsx`
- Create: `packages/ui/src/media/QueueList.prompt.md`
- Create: `packages/ui/src/media/QueueList.card.html`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Badge`, `Button`, `EmptyState` from the barrel (sibling `../core`, `../data`, `../feedback`); `MediaTrack` from `./types`; `formatDuration` from `./format`.
- Produces: `QueueList(props: QueueListProps)`, `interface QueueListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> { items: MediaTrack[]; nowPlaying?: MediaTrack | null; onRemove?: (index: number) => void; onClear?: () => void; emptyLabel?: string }`

**Note:** Import DS primitives by their source paths to avoid a self-referential package import inside the package. Verify exact paths first (Step 0).

- [ ] **Step 0: Confirm primitive import paths**

Run:
```bash
cd "$(git rev-parse --show-toplevel)/packages/ui/src" && grep -nE "export (function|\{) (Card|CardHeader|CardTitle|CardContent|Badge|Button|EmptyState)" core/Card.tsx core/Badge.tsx core/Button.tsx feedback/EmptyState.tsx
```
Expected: confirms `Card, CardHeader, CardTitle, CardContent` in `core/Card.tsx`; `Badge` in `core/Badge.tsx`; `Button` in `core/Button.tsx`; `EmptyState` in `feedback/EmptyState.tsx`. If `EmptyState`'s prop names differ from `{ title, description }`, adapt the call in Step 3 to its actual props (check `feedback/EmptyState.tsx`).

- [ ] **Step 1: Write the story**

`apps/storybook/src/media/QueueList.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { QueueList } from '@connor-adams/designsystem'

const items = [
  { id: '1', title: 'Resonance', source: 'YouTube', duration: 211 },
  { id: '2', title: 'Strobe', source: 'SoundCloud', duration: 634 },
  { id: '3', title: 'Nightcall', source: 'Spotify', duration: 258 },
]
const meta: Meta<typeof QueueList> = {
  title: 'Media/QueueList',
  component: QueueList,
  args: { items, nowPlaying: { id: '0', title: 'Midnight City', source: 'YouTube', duration: 244 }, onRemove: (i: number) => console.log('remove', i), onClear: () => console.log('clear') },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof QueueList>

export const Default: Story = {}
export const Empty: Story = { args: { items: [], nowPlaying: null } }
export const NoActions: Story = { args: { onRemove: undefined, onClear: undefined } }
```

- [ ] **Step 2: Run typecheck — verify it fails**

Run: `pnpm --filter @connor-adams/designsystem typecheck`
Expected: FAIL — no exported member `QueueList`.

- [ ] **Step 3: Implement the component**

`packages/ui/src/media/QueueList.tsx` (adjust the `EmptyState` props in the empty branch if Step 0 showed different prop names):
```tsx
import * as React from 'react'
import type { MediaTrack } from './types'
import { formatDuration } from './format'
import { Card, CardHeader, CardTitle, CardContent } from '../core/Card'
import { Badge } from '../core/Badge'
import { Button } from '../core/Button'
import { EmptyState } from '../feedback/EmptyState'

/**
 * Presentational queue of upcoming tracks with a count badge, optional Clear
 * action, and per-row remove. Pure display — no fetching or mutation; the
 * caller wires `onRemove`/`onClear` to its own state.
 */
export interface QueueListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  items: MediaTrack[]
  nowPlaying?: MediaTrack | null
  onRemove?: (index: number) => void
  onClear?: () => void
  emptyLabel?: string
}

function QueueRow({ track, index, onRemove }: { track: MediaTrack; index: number; onRemove?: (index: number) => void }): React.JSX.Element {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px', listStyle: 'none', borderRadius: 'var(--radius-md)' }}>
      <span style={{ width: 20, textAlign: 'right', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', flex: 'none' }}>{index + 1}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div title={track.title} style={{ fontSize: 'var(--text-body)', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
        {track.source && <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>{track.source}</div>}
      </div>
      {track.duration != null && <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', flex: 'none' }}>{formatDuration(track.duration)}</span>}
      {onRemove && (
        <button type="button" aria-label={`Remove ${track.title}`} onClick={() => onRemove(index)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: 'none', background: 'transparent', color: 'var(--muted-foreground)', cursor: 'pointer', borderRadius: 'var(--radius-full)', flex: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      )}
    </li>
  )
}

export function QueueList({ items, nowPlaying, onRemove, onClear, emptyLabel = 'Queue is empty', className, style, ...props }: QueueListProps): React.JSX.Element {
  const hasItems = items.length > 0
  return (
    <Card data-slot="queue-list" className={className} style={style} {...props}>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CardTitle>Queue</CardTitle>
            <Badge>{items.length}</Badge>
          </div>
          {hasItems && onClear && <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>}
        </div>
      </CardHeader>
      <CardContent>
        {nowPlaying && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 4px', marginBottom: 8, borderBottom: '1px solid var(--border)' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--primary)', fontWeight: 'var(--weight-semibold)' }}>Now playing</div>
              <div title={nowPlaying.title} style={{ fontSize: 'var(--text-body)', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nowPlaying.title}</div>
            </div>
            {nowPlaying.duration != null && <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{formatDuration(nowPlaying.duration)}</span>}
          </div>
        )}
        {hasItems ? (
          <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((track, index) => (
              <QueueRow key={track.id ?? index} track={track} index={index} onRemove={onRemove} />
            ))}
          </ul>
        ) : (
          <EmptyState title={emptyLabel} description="Add tracks to start playing." />
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Add the barrel export**

Append to `packages/ui/src/index.ts`:
```ts
export { QueueList } from './media/QueueList'
export type { QueueListProps } from './media/QueueList'
```

- [ ] **Step 5: Typecheck + validate — verify pass**

Run: `pnpm --filter @connor-adams/designsystem typecheck && pnpm validate`
Expected: clean; `✓ Contract OK`. If typecheck flags `Badge`/`Button`/`EmptyState` prop mismatches, fix the call sites to match their actual prop types (from Step 0) before continuing.

- [ ] **Step 6: Write the sidecars**

`packages/ui/src/media/QueueList.prompt.md`:
```markdown
Presentational queue of upcoming tracks with a count badge, Clear action, and per-row remove.

```jsx
<QueueList
  items={queue}
  nowPlaying={current}
  onRemove={(i) => removeAt(i)}
  onClear={() => clearQueue()}
/>
```

Pure display — wire `onRemove`/`onClear` to your own state. Shows an empty state when `items` is empty. Built on `Card`, `Badge`, `Button`, and `EmptyState`.
```

`packages/ui/src/media/QueueList.card.html`:
```html
<!-- @dsCard group="Media" viewport="480x420" name="QueueList" subtitle="Upcoming tracks — count, clear, per-row remove" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../../styles.css" />
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
<script src="../../_ds_bundle.js"></script>
<style>
  body { margin: 0; padding: 20px; background: var(--card); font-family: var(--font-sans); }
  .wrap { max-width: 420px; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
  const { QueueList } = window.CashflowDesignSystem_2cf89d;
  const { useState } = React;
  function Demo() {
    const [items, setItems] = useState([
      { id: '1', title: 'Resonance', source: 'YouTube', duration: 211 },
      { id: '2', title: 'Strobe', source: 'SoundCloud', duration: 634 },
      { id: '3', title: 'Nightcall', source: 'Spotify', duration: 258 },
    ]);
    return (
      <div className="wrap">
        <QueueList items={items} nowPlaying={{ id: '0', title: 'Midnight City', source: 'YouTube', duration: 244 }}
          onRemove={(i) => setItems((xs) => xs.filter((_, k) => k !== i))} onClear={() => setItems([])} />
      </div>
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<Demo />);
</script>
</body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/media/QueueList.tsx packages/ui/src/media/QueueList.prompt.md packages/ui/src/media/QueueList.card.html apps/storybook/src/media/QueueList.stories.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add QueueList media component"
```

---

## Task 8: useAudioPreview hook + final verification

**Files:**
- Create: `packages/ui/src/media/useAudioPreview.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `useAudioPreview(): { previewingSound: string | null; playPreview: (soundName: string, url: string) => void; stopPreview: () => void }`

- [ ] **Step 1: Implement the hook**

`packages/ui/src/media/useAudioPreview.ts`:
```ts
import { useState, useRef, useCallback, useEffect } from 'react'

const PREVIEW_VOLUME = 0.5

/**
 * Preview a one-off audio URL via a single `HTMLAudioElement`. Calling
 * `playPreview` with the currently-playing `soundName` toggles it off; a
 * different name swaps the source. Cleans up on unmount. Browser-only (uses
 * `window.Audio`).
 */
export function useAudioPreview(): {
  previewingSound: string | null
  playPreview: (soundName: string, url: string) => void
  stopPreview: () => void
} {
  const [previewingSound, setPreviewingSound] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopPreview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current = null
    }
    setPreviewingSound(null)
  }, [])

  const playPreview = useCallback(
    (soundName: string, url: string) => {
      if (previewingSound === soundName) {
        stopPreview()
        return
      }
      stopPreview()
      const audio = new Audio(url)
      audio.volume = PREVIEW_VOLUME
      audioRef.current = audio
      setPreviewingSound(soundName)
      audio.play().catch(() => stopPreview())
      audio.onended = stopPreview
      audio.onerror = () => stopPreview()
    },
    [previewingSound, stopPreview],
  )

  useEffect(() => stopPreview, [stopPreview])

  return { previewingSound, playPreview, stopPreview }
}
```

- [ ] **Step 2: Export the hook from the barrel**

Append to `packages/ui/src/index.ts`:
```ts
export { useAudioPreview } from './media/useAudioPreview'
```

- [ ] **Step 3: Typecheck + validate**

Run: `pnpm --filter @connor-adams/designsystem typecheck && pnpm validate`
Expected: typecheck clean; validate prints `Components: <n>`, `Skill-sidecar coverage: prompt.md 6/6, card.html 6/6` for the six media `.tsx`, and `✓ Contract OK`.

- [ ] **Step 4: Build the package (regenerates `_ds_bundle.js` for card demos)**

Run:
```bash
cd "$(git rev-parse --show-toplevel)" && pnpm build
```
Expected: tsup + bundle build succeeds with no errors.

- [ ] **Step 5: Storybook smoke check**

Run (then Ctrl-C after it serves):
```bash
cd "$(git rev-parse --show-toplevel)" && pnpm storybook
```
Expected: dev server starts; the `Media/*` stories appear in the sidebar and render without console errors.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/media/useAudioPreview.ts packages/ui/src/index.ts
git commit -m "feat(ui): add useAudioPreview hook to media category"
```

---

## Self-Review (completed during planning)

- **Spec coverage:** all six components + `MediaTrack` + `formatDuration` + `useAudioPreview` each have a task (Tasks 2–8); `media` added to CATEGORIES (Task 1); barrel + stories + sidecars per component; out-of-scope items intentionally absent. ✓
- **Placeholders:** none — every step has concrete code/commands and expected output. The one conditional (`EmptyState` prop names) is gated by an explicit verification step (Task 7 Step 0). ✓
- **Type consistency:** `MediaTrack` shape, `onSeek`/`onPlayPause`/`onSkip`/`onPrevious` signatures, and `autoTick` are consistent across `ProgressBar`, `MediaPlayer`, and the stories. `formatDuration` signature matches all callers. ✓
