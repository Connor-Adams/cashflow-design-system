# @connoradams/web — Design System docs site

The public documentation site for [`@connoradams/designsystem`](../../packages/ui): a Next.js (App Router) app with a landing page, a components index, and per-component pages (live preview, generated props table, usage notes, import snippet).

## Local development

From the **repo root**:

```bash
pnpm install
pnpm --filter @connoradams/designsystem build   # the site consumes the built package
pnpm --filter @connoradams/web dev               # http://localhost:3001
```

`pnpm build` (root) builds the whole workspace via turbo (library → Storybook → this site, in dependency order).

## How it works

- **Data pipeline** (`scripts/gen-data.mjs`, runs before `next build`): extracts component props with `react-docgen-typescript` (own-file props only), builds the component manifest, and collects usage notes from each component's `prompt.md`. Outputs the committed JSON under `src/generated/`.
- **Pages** are statically generated (`generateStaticParams`). Component previews are client components (`src/previews/`) because the design-system components use React hooks; the page shells stay Server Components.
- Storybook (`apps/storybook`) remains the exhaustive variant playground; this site is the polished public face with one representative preview per component.

## Deploy (Vercel)

This is a Next.js app in a pnpm/turbo monorepo. On Vercel:

- **Root Directory:** `apps/web`
- **Build Command:** `pnpm build` (or leave Vercel's Next.js auto-detection — it runs the `build` script, which runs `gen-data.mjs` then `next build`)
- **Install Command:** `pnpm install` (Vercel detects pnpm from the lockfile)
- **Output:** `.next` (auto-detected)
- No environment variables required.

Vercel auto-detects Next.js, so no `vercel.json` is needed unless you want to pin the build command.
