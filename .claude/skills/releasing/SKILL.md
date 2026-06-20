---
name: releasing
description: Use when versioning or publishing the Cashflow Design System packages (@connor-adams/designsystem and @connor-adams/tokens) — cutting a release, understanding the changesets + GitHub Packages flow, or debugging why a release published nothing. Covers the CI pipeline, the irreversible steps, and the changelog footguns.
---

# Releasing

## Overview

Two publishable packages, versioned **independently** via **changesets**, published to
**GitHub Packages** by CI — not by hand:

- `@connor-adams/designsystem` (`packages/ui`)
- `@connor-adams/tokens` (`packages/tokens`)

Apps (`storybook`, `web`) never publish (`private: true`; storybook is also in the
changeset `ignore` list — `web` is kept out **only** by `private`).

## The pipeline

`.github/workflows/release.yml` runs on **every push to `main`** and calls
`changesets/action`, which has two modes:

1. **Pending changesets exist on main** → it runs `pnpm changeset version` (bumps
   `package.json` versions, deletes the consumed `.changeset/*.md`, writes
   **per-package** CHANGELOGs) and opens/updates a **"version packages" PR**. It does
   **not** publish on this run.
2. **No pending changesets** (the version PR merged) → it runs `pnpm changeset
   publish`: publishes any package whose version isn't yet on the registry and
   **creates git tags** `@connor-adams/<pkg>@<version>`.

Registry `https://npm.pkg.github.com`, scope `@connor-adams`, `access: restricted`.
CI auth uses the built-in `GITHUB_TOKEN` (`packages: write`). **Consumers** need a PAT
with `read:packages` + an `.npmrc` (see `packages/ui/README.md`).

## Cutting a release (the normal path — all via PRs)

1. Ensure each shippable change has a changeset (`pnpm changeset`, commit the `.md`).
2. Merge those PRs to `main`.
3. CI opens a **"version packages" PR**. Review it — confirm the version bumps and the
   per-package CHANGELOG entries are right.
4. **Merge the version PR.** ⚠️ This is the trigger: the next CI run runs
   `changeset publish` — **publishing to GitHub Packages and pushing tags is
   IRREVERSIBLE** (a published version can never be overwritten or re-pushed).

You generally do nothing locally. **Never run `pnpm release` locally** — the root
script (`turbo run build && changeset publish`) publishes straight from your machine
with a valid token, bypassing the version-PR review gate.

## Footguns (read before touching a release)

- **No pending changesets = nothing publishes.** The next CI run is a no-op if no
  `.changeset/*.md` files exist — regardless of how much unreleased work is on main.
  If a backlog shipped without changesets, **author changesets retroactively** before
  expecting a release. Check first: `pnpm exec changeset status`.
- **Two changelog mechanisms that drift.** The hand-maintained root `CHANGELOG.md` is
  **disconnected** from changesets, which write *per-package* CHANGELOGs. Don't treat
  the root file as the release source of truth; changesets own versions. (Ignore
  `CONTRIBUTING.md`'s versioning section for releases — it documents the OLD manual
  `package.json`-bump flow.)
- **Independent versioning.** `fixed: []`, `linked: []` — tokens and UI bump
  separately. A token-only change won't bump the UI package's version (only its
  internal dep range, via `updateInternalDependencies: patch`).
- **Restricted access** means anonymous/mis-scoped installs fail with an opaque
  401/404, not a clear "auth required."
- **Fresh worktree** has no deps — `pnpm install` before any local changeset command,
  or `changeset` is "command not found." In an agent/CI worktree `node_modules` may be
  a symlink into the primary checkout and `pnpm install` fails with `ENOTDIR`; in that
  case don't fight it — read changeset state from the CI **"version packages" PR**
  instead of running `changeset status` locally.

## Verify (safe, read-only)

```bash
pnpm install                       # if deps missing
pnpm exec changeset status         # what will bump, or "no changesets" no-op
git tag -l '@connor-adams/*'       # what's already published
```

**After publishing**, confirm it landed: `git tag -l '@connor-adams/*'` should show
the new `@connor-adams/<pkg>@<version>` tag. No new tag = `publish` ran as a no-op
(usually: no changeset was pending).

## Never do these casually

- `pnpm changeset publish` / `pnpm release` locally — **irreversible publish + tags**.
- `git tag` / `git push --tags` of a release tag — effectively irreversible.
- Removing `private` from `apps/web` — it would become publishable (not in `ignore`).
