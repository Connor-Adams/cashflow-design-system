# DS Bulk Component Conversion — Implementation Plan (Plan 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the remaining 42 hand-written `.jsx` + standalone `.d.ts` components into typed `.tsx` source under `@connoradams/designsystem`, re-exporting every component and type through the package barrel, so the full component library is importable and type-checks under strict mode.

**Architecture:** Apply the proven Button conversion recipe (Plan 1, Task 3) to every component, one category at a time. Each component is self-contained inline-style React (verified: zero intra-package imports), so conversion order is irrelevant. The `.tsx` merges the `.jsx` runtime with the `.d.ts` types; the standalone `.d.ts` is retired. Each category task appends its exports to `src/index.ts`; a final task verifies the whole package builds.

**Tech Stack:** TypeScript 5.6 strict, tsup 8, React 18. No new dependencies.

**Canonical worked example:** `packages/ui/src/core/Button.tsx` (already converted) is the reference. Every conversion in this plan follows its pattern. The original `.jsx` and `.d.ts` for each component ARE the per-component spec — this plan defines the mechanical transform, not 42 hand-written files. This is a deliberate, justified departure from "complete code in every step": the transform is a repeated, well-defined mechanical port over existing source, with a committed reference implementation.

## Global Constraints

These bind EVERY task. They are the conversion recipe.

**Source transform (per component file `components/<cat>/<Name>.jsx` + `<Name>.d.ts` → `packages/ui/src/<cat>/<Name>.tsx`):**
1. **Imports:** `import React from 'react'` → `import * as React from 'react'` (namespace import — `verbatimModuleSyntax` rejects the default import).
2. **Merge, don't rewrite:** copy the `.jsx` runtime verbatim, then layer on the types from the `.d.ts`. Preserve ALL exported values (including compound sub-components and helper functions) and ALL exported types (the `Props` interface AND every helper type/union — e.g. `BadgeVariant`, `ComboboxOption`, `TableRowProps`).
3. **Preserve runtime behavior and tokens EXACTLY:** do not change any CSS-variable name, style value, DOM structure, `data-*` attribute, ARIA attribute, or control flow. Keep existing `|| fallback` / `?? fallback` expressions verbatim even when typing makes them statically unreachable — behavior parity over cleanup. (Cleanup of dead fallbacks is explicitly out of scope here.)
4. **Typing rules (strict mode: `strict`, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, `isolatedModules`):**
   - Type the component signature via its `Props` interface: `export function Name({ ...destructured }: NameProps): React.JSX.Element`.
   - `React.useState(init)` → annotate when the initial value under-constrains the type, e.g. `React.useState<string | null>(defaultValue)`; otherwise let inference stand.
   - `React.useRef(null)` → `React.useRef<HTMLDivElement>(null)` (use the actual element type the ref attaches to).
   - JSX event handlers use React synthetic event types: `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`, `React.KeyboardEvent`, etc.
   - `document.addEventListener` / `removeEventListener` handlers use DOM lib types: `(e: MouseEvent)`, `(e: KeyboardEvent)`.
   - A lookup table indexed by a finite literal-union key should be typed `Record<TheUnion, React.CSSProperties>` (or the relevant value type) — indexing it by a union-typed variable returns the value type, NOT `value | undefined`, so `noUncheckedIndexedAccess` does not fire. Indexing an array or a `Record<string, V>` by an arbitrary `string`/`number` DOES return `V | undefined`; guard or `?.` it.
   - **CSS-var-in-typed-style cast:** when a `var(--x)` string is assigned to a numerically-typed style property (`fontWeight`, `lineHeight`, `zIndex`, `opacity`, etc.), cast it: `fontWeight: 'var(--weight-bold)' as React.CSSProperties['fontWeight']`. String-valued properties (`textTransform: 'uppercase'`, `background`, `color`) need no cast. Use the narrowest cast that compiles; never cast a whole style object to `any`.
   - No `any`. No `@ts-ignore`/`@ts-expect-error`. If a genuine type problem resists these rules, report it — do not paper over it.
5. **Retire old source:** delete `components/<cat>/<Name>.jsx` and `components/<cat>/<Name>.d.ts`. Move skill sidecars with history: `git mv components/<cat>/<Name>.prompt.md packages/ui/src/<cat>/<Name>.prompt.md` and the same for `<Name>.card.html` — for whichever of those exist. Also move the category-index sidecars `git mv components/<cat>/<cat>.card.html` / `<cat>.prompt.md` (where present) into `packages/ui/src/<cat>/`. Use `git mv`; if the sandbox blocks `git mv`/`git rm`, fall back to `mv` + `git add -A` so git records the rename/delete (Plan 1 used this successfully).
6. **Barrel (`packages/ui/src/index.ts`):** append (never remove existing lines) one value-export and one type-export line per component:
   ```ts
   export { Name } from './<cat>/Name'                 // include EVERY value the file exports
   export type { NameProps /*, helper types */ } from './<cat>/Name'
   ```
   For compound components, list all value exports: `export { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core/Card'`. Derive the exact symbol lists from the converted `.tsx`'s `export` statements (values) and the original `.d.ts`'s `export type`/`export interface` declarations (types). Every exported type must be re-exported.

**Verification gate (every category task):** `pnpm --filter @connoradams/designsystem typecheck` exits 0 with no diagnostics after that category's components are converted and barrelled.

**Scope boundary:** This plan converts the 42 components only. The `foundations/`, `templates/`, and `ui_kits/` directories are NOT touched (deferred to a later plan). Do not add Storybook stories (Plan 3). Do not modify token CSS.

---

### Task 1: Convert `core` (10 components)

**Components & value exports** (derive type exports from each `.d.ts`):
- `Accordion` — exports: `Accordion` (types incl. `AccordionItem`, `AccordionProps`)
- `Avatar` — `Avatar` (`AvatarProps`)
- `Badge` — `Badge` (`BadgeProps`, `BadgeVariant`)
- `Card` — **compound:** `Card, CardHeader, CardTitle, CardDescription, CardContent` (`CardProps`)
- `Kbd` — `Kbd` (`KbdProps`)
- `Link` — `Link` (`LinkProps`)
- `Progress` — `Progress` (`ProgressProps`)
- `Separator` — `Separator` (`SeparatorProps`)
- `Spinner` — `Spinner` (`SpinnerProps`)
- `Text` — `Text` (`TextProps`, `TextTone`, `TextVariant`, `TextWeight`)

**Files:** Create `packages/ui/src/core/<Name>.tsx` for each (10). Move each `<Name>.prompt.md`/`.card.html` sidecar that exists + the `core.card.html` category index. Delete each `<Name>.jsx` + `<Name>.d.ts`. Modify `packages/ui/src/index.ts`.

**Interfaces:** Produces barrel exports for all 10 core components and their types. `Button` already in barrel — do not duplicate.

- [ ] **Step 1: Convert all 10 components** per the Global Constraints recipe, reading each `components/core/<Name>.jsx` + `.d.ts` and writing `packages/ui/src/core/<Name>.tsx`. Note `Card` is compound (5 exports).

- [ ] **Step 2: Move sidecars and remove old source** for all 10 (and the `core.card.html` index), via `git mv` / `git rm` (or `mv` + `git add -A` fallback).

- [ ] **Step 3: Append barrel exports** to `packages/ui/src/index.ts` — one `export {…}` (all values) and one `export type {…}` (all types) line per component.

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @connoradams/designsystem typecheck`
Expected: PASS (exit 0, no diagnostics).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(ui): convert core components to typed .tsx"
```

---

### Task 2: Convert `data` (4 components)

**Components & value exports:**
- `LetterAvatar` — `LetterAvatar` (`LetterAvatarProps`, `LetterAvatarSize`)
- `StatCard` — **two value exports:** `resolveDeltaTone, StatCard` (`StatCardProps`, `MetricKind`) — keep `resolveDeltaTone` exported (preserve public surface); type its params/return.
- `Table` — **compound:** `Table, TableHeader, TableBody, TableRow, TableHead, TableCell` (`TableProps`, `TableRowProps`)
- `Tabs` — `Tabs` (`TabsProps`, `TabItem`)

**Files:** Create 4 `.tsx` under `packages/ui/src/data/`. Move sidecars incl. `data.card.html` + `data.prompt.md` indexes. Delete old `.jsx`/`.d.ts`. Modify barrel.

- [ ] **Step 1: Convert all 4 components** per recipe. `Table` is compound (6 exports); `StatCard` also exports the `resolveDeltaTone` helper.
- [ ] **Step 2: Move sidecars (+ `data.card.html`, `data.prompt.md`) and remove old source.**
- [ ] **Step 3: Append barrel exports** for all 4.
- [ ] **Step 4: Typecheck** — `pnpm --filter @connoradams/designsystem typecheck` → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(ui): convert data components to typed .tsx"`

---

### Task 3: Convert `feedback` (3 components)

**Components & value exports:**
- `Alert` — `Alert` (`AlertProps`, `AlertVariant`)
- `EmptyState` — `EmptyState` (`EmptyStateProps`)
- `Skeleton` — **two exports:** `Skeleton, SkeletonText` (`SkeletonProps`, `SkeletonTextProps`)

**Files:** Create 3 `.tsx` under `packages/ui/src/feedback/`. Move sidecars incl. `feedback.card.html` + `feedback.prompt.md`. Delete old. Modify barrel.

- [ ] **Step 1: Convert all 3** per recipe (`Skeleton` has 2 value exports).
- [ ] **Step 2: Move sidecars (+ category indexes) and remove old source.**
- [ ] **Step 3: Append barrel exports** for all 3.
- [ ] **Step 4: Typecheck** → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(ui): convert feedback components to typed .tsx"`

---

### Task 4: Convert `finance` (8 components)

**Components & value exports** (all single-export):
- `AccountCard` (`AccountCardProps`), `AmountText` (`AmountTextProps`), `BudgetMeter` (`BudgetMeterProps`), `CategoryPill` (`CategoryPillProps`), `ImportDropzone` (`ImportDropzoneProps`), `MoneyInput` (`MoneyInputProps`), `PeriodSelector` (`PeriodSelectorProps`, `PeriodPreset`), `Sparkline` (`SparklineProps`)

**Files:** Create 8 `.tsx` under `packages/ui/src/finance/`. Each finance component has a `.prompt.md` + `.card.html` sidecar — move both per component. Delete old. Modify barrel.

- [ ] **Step 1: Convert all 8** per recipe. `MoneyInput`/`ImportDropzone` are likely stateful (refs/handlers) — apply the event/ref typing rules.
- [ ] **Step 2: Move all sidecars (each has `.prompt.md` + `.card.html`) and remove old source.**
- [ ] **Step 3: Append barrel exports** for all 8.
- [ ] **Step 4: Typecheck** → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(ui): convert finance components to typed .tsx"`

---

### Task 5: Convert `forms` (11 components)

**Components & value exports** (all single-export):
- `Checkbox` (`CheckboxProps`), `Combobox` (`ComboboxProps`, `ComboboxOption`), `Input` (`InputProps`), `Label` (`LabelProps`), `NativeSelect` (`NativeSelectProps`, `SelectOption`), `RadioGroup` (`RadioGroupProps`, `RadioOption`), `Slider` (`SliderProps`), `Stepper` (`StepperProps`), `Switch` (`SwitchProps`), `Textarea` (`TextareaProps`), `ToggleGroup` (`ToggleGroupProps`, `ToggleItem`)

**Files:** Create 11 `.tsx` under `packages/ui/src/forms/`. Move sidecars incl. `forms.card.html` + `forms.prompt.md`. Delete old. Modify barrel.

**Note:** This is the largest category and contains the most stateful components (`Combobox`, `Slider`, `Stepper`, `RadioGroup`, `ToggleGroup`). `Combobox` is the worked stateful example — it uses `useState<string|null>`, `useRef<HTMLDivElement>`, `document` listeners typed as native `MouseEvent`/`KeyboardEvent`, and `React.ChangeEvent<HTMLInputElement>` on the input. Apply the same patterns to the others. If this task's context grows too large to convert all 11 reliably in one pass, convert and typecheck them in two sub-batches but COMMIT once at the end (single commit for the category) — and report that you batched.

- [ ] **Step 1: Convert all 11** per recipe.
- [ ] **Step 2: Move sidecars (+ category indexes) and remove old source.**
- [ ] **Step 3: Append barrel exports** for all 11.
- [ ] **Step 4: Typecheck** → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(ui): convert forms components to typed .tsx"`

---

### Task 6: Convert `navigation` (2 components)

**Components & value exports:**
- `Breadcrumb` (`BreadcrumbProps`, `BreadcrumbItem`)
- `Pagination` (`PaginationProps`)

**Files:** Create 2 `.tsx` under `packages/ui/src/navigation/`. Each has `.prompt.md` + `.card.html`; move both. (No `navigation.*` category index exists — skip if absent.) Delete old. Modify barrel.

- [ ] **Step 1: Convert both** per recipe.
- [ ] **Step 2: Move sidecars and remove old source.**
- [ ] **Step 3: Append barrel exports** for both.
- [ ] **Step 4: Typecheck** → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(ui): convert navigation components to typed .tsx"`

---

### Task 7: Convert `overlays` (4 components)

**Components & value exports:**
- `Dialog` (`DialogProps`), `DropdownMenu` (`DropdownMenuProps`, `DropdownItem`), `Toast` (`ToastProps`), `Tooltip` (`TooltipProps`)

**Files:** Create 4 `.tsx` under `packages/ui/src/overlays/`. Move sidecars incl. `overlays.card.html` + `overlays.prompt.md`. Delete old. Modify barrel.

**Note:** Overlays are portal/positioning/focus components — expect `useRef`, `useEffect`, `document` listeners, and possibly `createPortal`. Apply the event/ref typing rules; `createPortal` needs no special handling beyond importing it from `react-dom` (`import * as ReactDOM from 'react-dom'` if used).

- [ ] **Step 1: Convert all 4** per recipe.
- [ ] **Step 2: Move sidecars (+ category indexes) and remove old source.**
- [ ] **Step 3: Append barrel exports** for all 4.
- [ ] **Step 4: Typecheck** → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(ui): convert overlays components to typed .tsx"`

---

### Task 8: Whole-package verification

Confirm the full converted library builds, types generate for all 43 components, and no orphaned source remains.

**Files:** None created. Verification only (plus a barrel sanity read).

- [ ] **Step 1: Confirm `components/` is empty of source**

Run: `find components -name '*.jsx' -o -name '*.d.ts' | head`
Expected: NO output (all `.jsx`/`.d.ts` migrated). If any remain, they were missed — go back and convert them.

- [ ] **Step 2: Full typecheck**

Run: `pnpm --filter @connoradams/designsystem typecheck`
Expected: PASS (exit 0).

- [ ] **Step 3: Build the library (tsup emits ESM + dts for the whole barrel)**

Run: `pnpm --filter @connoradams/designsystem build`
Expected: tsup ESM + DTS build success, exits 0. (DTS generation type-checks the full public surface — a failure here means a barrel export references a missing/wrong type.)

- [ ] **Step 4: Verify the generated types include a representative spread of components**

Run: `grep -cE "AccordionProps|TableProps|ComboboxProps|DialogProps|SparklineProps|StatCardProps" packages/ui/dist/index.d.ts`
Expected: ≥6 (one per probed type — all present in the generated declarations).

- [ ] **Step 5: Confirm Storybook still builds (Button story unaffected)**

Run: `pnpm --filter @connoradams/storybook build`
Expected: exits 0 (the package's new exports don't break the existing consumer).

- [ ] **Step 6: Commit** (only if any fix was needed in Steps 1–5; otherwise skip — Tasks 1–7 already committed all source)

```bash
git add -A
git commit -m "fix(ui): resolve bulk-conversion verification findings"
```

---

## Self-Review

**Spec coverage:** All 42 remaining components are assigned to exactly one category task (core 10, data 4, feedback 3, finance 8, forms 11, navigation 2, overlays 4 = 42). Compound components (Card, Table, Skeleton) and the `resolveDeltaTone` helper export are called out explicitly. Every component's helper types are named for re-export. Task 8 verifies the whole. ✅

**Placeholder scan:** No "TBD"/"handle edge cases"/"similar to Task N". The recipe is concrete; per-component source is the spec by design (stated in the header, with `Button.tsx` as the committed reference). The one judgment-bearing instruction ("derive exact symbol lists from the converted `.tsx`") is precise and verifiable. ✅

**Type consistency:** Barrel export format is identical across tasks; the strict-mode typing rules are defined once in Global Constraints and referenced by every task. The verification gate (`typecheck`) is the same per task and re-run wholesale in Task 8. ✅

**Known risk:** A category subagent could mis-type a stateful component (event/ref generics). Mitigation: the per-category `typecheck` gate fails fast, and `Combobox` is documented as the worked stateful example. The final tsup build (Task 8 Step 3) is a second gate via DTS generation.
