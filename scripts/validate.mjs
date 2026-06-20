// Validate @connor-adams/designsystem structural contract.
// FATAL: every component .tsx must be (a) exported from the barrel and (b) have a Storybook story.
// INFO (non-fatal): skill-sidecar (.prompt.md / .card.html) coverage.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const UI_SRC = 'packages/ui/src'
const STORY_SRC = 'apps/storybook/src'
const CATEGORIES = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']

const barrel = readFileSync(join(UI_SRC, 'index.ts'), 'utf8')

const errors = []
let total = 0, withPrompt = 0, withCard = 0

for (const cat of CATEGORIES) {
  const dir = join(UI_SRC, cat)
  if (!existsSync(dir)) { errors.push(`missing category dir: ${dir}`); continue }
  const components = readdirSync(dir).filter((f) => f.endsWith('.tsx')).map((f) => f.replace(/\.tsx$/, ''))
  for (const name of components) {
    total++
    // (a) barrel export — the file is referenced by its relative module path
    if (!barrel.includes(`./${cat}/${name}'`)) errors.push(`not exported from barrel: ${cat}/${name}`)
    // (b) story exists
    if (!existsSync(join(STORY_SRC, cat, `${name}.stories.tsx`))) errors.push(`missing story: ${cat}/${name}.stories.tsx`)
    // sidecar coverage (info)
    if (existsSync(join(dir, `${name}.prompt.md`))) withPrompt++
    if (existsSync(join(dir, `${name}.card.html`))) withCard++
  }
}

console.log(`Components: ${total}`)
console.log(`Skill-sidecar coverage: prompt.md ${withPrompt}/${total}, card.html ${withCard}/${total}`)
if (errors.length) {
  console.error(`\nContract violations (${errors.length}):`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log('\n✓ Contract OK: every component is barrel-exported and storied.')
