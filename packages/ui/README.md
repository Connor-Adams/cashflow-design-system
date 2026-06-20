# @connor-adams/designsystem

A portable React design system — 43 typed components built on CSS-variable design tokens. One import, brand-consistent, strict-typed.

Published to **GitHub Packages** (semi-private): installable by anyone with read access to the [repo](https://github.com/connor-adams/cashflow-design-system).

## Install

GitHub Packages requires a one-time registry + auth setup for the `@connor-adams` scope.

**1. Create a GitHub token** with the `read:packages` scope (Settings → Developer settings → Personal access tokens). Each collaborator needs their own.

**2. Add an `.npmrc`** to your consuming project (or `~/.npmrc`):

```ini
@connor-adams:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Set `GITHUB_TOKEN` in your environment to the token from step 1 (don't commit the raw token). CI runners can use their built-in `GITHUB_TOKEN`.

**3. Install** (React 18+ is a peer dependency):

```bash
npm i @connor-adams/designsystem react react-dom
```

The runtime dependency `@connor-adams/tokens` (the CSS variables) installs automatically from the same registry.

## Use

```tsx
import { Button, Card, AmountText } from '@connor-adams/designsystem'

export function Example() {
  return (
    <Card>
      <Button variant="primary">Add transaction</Button>
      <AmountText value={3240} direction="out" />
    </Card>
  )
}
```

- **Styles:** no separate CSS import needed. The package's JS entry side-effect-imports its own bundled stylesheet — the token layer (colors, type, spacing, fonts, as CSS custom properties) plus every component's CSS — so importing the package is enough. Requires a bundler that processes CSS from `node_modules` (Vite, Next, webpack, Parcel — all do). If you link the stylesheet directly instead, `@connor-adams/designsystem/styles.css` is still exported.
- **Types:** every component ships generated `.d.ts`; props are fully typed.
- **ESM-only**, tree-shakeable. React/React-DOM are peer deps (not bundled).

## What's inside

`core` (Button, Card, Badge, Text, …) · `data` (Table, StatCard, Tabs, …) · `feedback` (Alert, Skeleton, …) · `finance` (AccountCard, MoneyInput, Sparkline, …) · `forms` (Combobox, Slider, Switch, …) · `navigation` (Breadcrumb, Pagination) · `overlays` (Dialog, Toast, Tooltip, …).

Browse them: run the docs site (`apps/web`) or Storybook (`apps/storybook`) from the monorepo.

## Versioning

Releases are managed with [changesets](https://github.com/changesets/changesets) and published automatically from `main` via GitHub Actions.
