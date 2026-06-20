import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { withCustomConfig } from 'react-docgen-typescript'

const UI_SRC = join(process.cwd(), '../../packages/ui/src')
const OUT = join(process.cwd(), 'src/generated')
const CATEGORIES = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// Discover components
const manifest = []
const filePaths = []
for (const category of CATEGORIES) {
  const dir = join(UI_SRC, category)
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.tsx') && !x.endsWith('.test.tsx'))) {
    const name = f.replace(/\.tsx$/, '')
    manifest.push({ slug: kebab(name), name, category })
    filePaths.push(join(dir, f))
  }
}

// Props via react-docgen-typescript — own-file props only (drop inherited HTML attrs)
// propFilter: drop props whose parent is from node_modules OR from a different source file
// This ensures we only keep props declared in the component's own .tsx file.
const parser = withCustomConfig(join(process.cwd(), '../../tsconfig.base.json'), {
  savePropValueAsString: true,
  propFilter: (prop, component) => {
    if (prop.parent) {
      // Drop anything sourced from node_modules (React.HTMLAttributes, etc.)
      if (/node_modules/.test(prop.parent.fileName)) return false
      // Drop props from a different source file than the component file itself
      if (component.fileName && prop.parent.fileName !== component.fileName) return false
    }
    return true
  },
})
const docs = parser.parse(filePaths)
const props = {}
for (const d of docs) {
  props[d.displayName] = Object.values(d.props || {}).map((p) => ({
    name: p.name,
    type: p.type?.name ?? '',
    required: !!p.required,
    defaultValue: p.defaultValue?.value ?? null,
    description: p.description ?? '',
  }))
}
// Keep only the primary components (drop compound sub-component entries like
// CardHeader/TableRow that docgen also returns — they have no manifest entry/route).
const manifestNames = new Set(manifest.map((e) => e.name))
for (const k of Object.keys(props)) if (!manifestNames.has(k)) delete props[k]

// Usage notes from prompt.md
const usage = {}
for (const { slug, name, category } of manifest) {
  const md = join(UI_SRC, category, `${name}.prompt.md`)
  usage[slug] = existsSync(md) ? readFileSync(md, 'utf8') : ''
}

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(OUT, 'props.json'), JSON.stringify(props, null, 2))
writeFileSync(join(OUT, 'usage.json'), JSON.stringify(usage, null, 2))
console.log(`gen-data: ${manifest.length} components, ${docs.length} with props`)
