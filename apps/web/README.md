# @connor-adams/web — Design System docs site

The public documentation site for [`@connor-adams/designsystem`](../../packages/ui): a Next.js (App Router) app with a landing page, a components index, and per-component pages (live preview, generated props table, usage notes, import snippet).

## Local development

From the **repo root**:

```bash
pnpm install
pnpm --filter @connor-adams/designsystem build   # the site consumes the built package
pnpm --filter @connor-adams/web dev               # http://localhost:3001
```

`pnpm build` (root) builds the whole workspace via turbo (library → Storybook → this site, in dependency order).

## How it works

- **Data pipeline** (`scripts/gen-data.mjs`, runs before `next build`): extracts component props with `react-docgen-typescript` (own-file props only), builds the component manifest, and collects usage notes from each component's `prompt.md`. Outputs the committed JSON under `src/generated/`.
- **Pages** are statically generated (`generateStaticParams`). Component previews are client components (`src/previews/`) because the design-system components use React hooks; the page shells stay Server Components.
- Storybook (`apps/storybook`) remains the exhaustive variant playground; this site is the polished public face with one representative preview per component.

## Deploy (Vercel)

This is a Next.js app in a pnpm/turbo monorepo. The build is pinned in [`vercel.json`](./vercel.json) — **do not** rely on Vercel's Next.js auto-detection. Auto-detection runs only this package's `build` script (`gen-data.mjs && next build`), which does **not** build the `@connor-adams/designsystem` workspace dependency first, so the import of its `dist` fails. The build must go through turbo so `^build` builds `tokens → ui → web` in order.

Vercel project settings:

- **Root Directory:** `apps/web` (Vercel reads `apps/web/vercel.json` from here)
- **Include files outside the Root Directory:** ON (needed to reach `../../packages`)
- **Node.js Version:** 22.x (matches `.nvmrc`)
- **Build / Install Command:** pinned in `vercel.json` (turbo filter build; install runs from the repo root)
- **Output:** `.next` (auto-detected from `framework: nextjs`)
- No environment variables required.
