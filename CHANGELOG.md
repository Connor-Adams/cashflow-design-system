# Changelog

All notable changes to the Cashflow Design System are recorded here.
The format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- **Finance primitives:** AmountText (green-in/oxblood-out money values),
  MoneyInput (currency field + in/out toggle), CategoryPill (tinted category
  chips with built-in icons), Sparkline (trend lines), PeriodSelector (ledger
  date-range control), AccountCard (connected-account tile), BudgetMeter
  (self-coloring budget row), ImportDropzone (statement import). New "Finance"
  card group (8 cards).
- **Templates:** Transactions List (`templates/transactions/`) added alongside
  the Cashflow Dashboard.
- **Core primitives:** Text (full type scale), Link, Separator, Spinner, Kbd,
  Avatar, Progress, Accordion.
- **Form controls:** Switch, Checkbox, RadioGroup, Slider, ToggleGroup
  (segmented control), Stepper, Combobox (searchable select).
- **Overlays:** Dialog, Tooltip, Toast, DropdownMenu.
- **Navigation:** Breadcrumb, Pagination.
- **Template:** `templates/cashflow-app/` — Cashflow Dashboard starting point.
- One foundation/component card per primitive in the Design System tab.

### Changed
- **UI kit** dashboard + transactions screens now use CategoryPill and
  AmountText in place of hand-coded badges and money spans.
- **Cashflow Dashboard template** now composes the finance primitives:
  PeriodSelector in the header, CategoryPill chips, AmountText money values,
  and a Sparkline spend trend — replacing hand-coded spans.
- Logo mark: solid oxblood→honey gradient wordmark with a hero-gradient
  underline; coin mark arrows now use the hero gradient. Raster + favicon
  exports regenerated to match.
- Component cards now render on the white `var(--card)` canvas for consistency
  with the foundation cards.
- Avatar palette converted to diagonal gradient slots (`--avatar-grad-1…12`).

### Removed
- Deprecated `@startingPoint` tags (6) — consuming projects use templates now.

## [0.1.0]

### Added
- Initial design system: tokens (colors, typography, spacing), fonts,
  core/forms/data/feedback components, foundation specimen cards, the
  Cashflow App UI kit, and an Agent-Skills-compatible `SKILL.md`.
