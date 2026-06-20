# @connor-adams/designsystem

## 0.3.0

### Minor Changes

- 30af5a0: Add CategoryBreakdown component — a card with a ranked horizontal-bar breakdown of money by category, composed from existing primitives.

## 0.2.0

### Minor Changes

- 1d5cd7b: Move all component interactive states (hover, focus-visible, active, disabled) from JS-driven inline styles into co-located CSS, keyed off `data-variant`/`data-size`. Every component now uses `React.forwardRef` and merges the consumer `className`. This adds visible keyboard focus rings across the library (WCAG 2.4.7), removes re-render-on-hover, and ships a single bundled `dist/index.css` (re-exported by `styles.css`).

  Also adds a vitest + Testing Library suite (one `*.test.tsx` per component, 350 tests) wired into CI.
