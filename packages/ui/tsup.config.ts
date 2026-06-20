import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  // Re-attach the styling to the JS entry so importing the package pulls it in.
  // tsup concatenates each component's `import './X.css'` into dist/index.css but
  // strips the reference from the JS. We point the banner at the package's
  // layered styles.css (not the flat dist/index.css) so the @layer order — tokens
  // as `base`, components as `components` — is preserved. ../ is relative to the
  // emitted dist/index.js. sideEffects: ["*.css"] keeps it from being tree-shaken.
  banner: { js: 'import "../styles.css";' },
})
