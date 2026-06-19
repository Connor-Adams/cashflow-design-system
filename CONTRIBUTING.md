# Contributing to the Cashflow Design System

This is a **living design system**. The source of truth is the CSS tokens and the
React component sources — everything else (the bundle, the manifest, the
adherence config) is generated.

## Source of truth

| What | Where |
|---|---|
| Global entry point | `styles.css` — a list of `@import`s only, never inline rules |
| Tokens | `tokens/*.css` — base values + semantic aliases on `:root` |
| Fonts | `@font-face` rules inside the `styles.css` import closure |
| Components | `components/<group>/<Name>.{jsx,d.ts,prompt.md}` |
| Foundation cards | `foundations/*.html` |
| Templates | `templates/<slug>/` |
| Brand assets | `assets/` |

**Never edit** `_ds_bundle.js`, `_ds_manifest.json`, or `_adherence.oxlintrc.json` —
they are regenerated from the sources on every change and are git-ignored.

## Adding a component

A component is four files in the same directory:

1. `Name.jsx` — `export function Name(props) { … }` (named PascalCase export,
   React only, style via the CSS custom properties — no CSS-in-JS, no npm deps).
2. `Name.d.ts` — the props interface (this is what gives the component its
   contract and starting-point eligibility).
3. `Name.prompt.md` — one-sentence "what & when", a small JSX usage example,
   then notable variants/props.
4. A `@dsCard`-tagged `.html` in the directory showing key states. First line:
   `<!-- @dsCard group="Components" viewport="700x<h>" name="<Name>" subtitle="…" -->`

Cards must:
- link `styles.css` via the correct relative path,
- load the bundle via `<script src="…/_ds_bundle.js">`,
- mount with `const { Name } = window.CashflowDesignSystem_2cf89d` in a
  `<script type="text/babel">` block,
- render on the white canvas (`background: var(--card)`), matching the others.

### Conventions
- One card per primitive — don't group multiple component types on one card.
- Reach through the token layer for every color, radius, shadow, and font.
- Support dark mode for free by using semantic tokens (no hard-coded hex).
- Keep components self-contained; siblings may import each other relatively.

## Adding tokens

Declare `--*` custom properties under `:root` (or a single theme scope) in a file
reachable from `styles.css`. Add both a base value and, where useful, a semantic
alias. Add a foundation card to `foundations/` so it shows in the Design System tab.

## Versioning

Bump `package.json` and add a `CHANGELOG.md` entry for any change that adds,
removes, or alters a component's public API or a token's value.
