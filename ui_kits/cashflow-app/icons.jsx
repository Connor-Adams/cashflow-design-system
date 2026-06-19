/* Lucide icon renderer for the Cashflow UI kit.
 * Cashflow uses lucide-react throughout; here we render the same stroke icons
 * from the lucide UMD global (window.lucide.icons, PascalCase keys). */

const ATTR_MAP = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'stroke-dasharray': 'strokeDasharray',
}
function toReactAttrs(attrs) {
  const out = {}
  for (const k in attrs) out[ATTR_MAP[k] || k] = attrs[k]
  return out
}

/* Collect every [tag(string), attrs] leaf, tolerating either a flat icon node
 * (Array of [tag, attrs]) or one wrapped a level deeper across lucide builds. */
function collectLeaves(node, out) {
  if (!Array.isArray(node)) return
  if (typeof node[0] === 'string' && (node[1] == null || typeof node[1] === 'object')) {
    out.push(node)
    return
  }
  for (const child of node) collectLeaves(child, out)
}

function lookupIcon(name) {
  const L = window.lucide
  if (!L) return null
  const icons = L.icons || L
  return icons[name] || null
}

function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 2, style }) {
  const data = lookupIcon(name)
  if (!data) return <span style={{ width: size, height: size, display: 'inline-block', ...style }} />
  const leaves = []
  collectLeaves(data, leaves)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {leaves.map((child, i) => React.createElement(child[0], { key: i, ...toReactAttrs(child[1] || {}) }))}
    </svg>
  )
}

window.CFIcon = Icon
