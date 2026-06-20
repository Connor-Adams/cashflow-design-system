import { defineConfig } from 'tsup'
import { readFile, writeFile } from 'node:fs/promises'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  // Re-attach the styling to the JS entry so importing the package pulls it in.
  // tsup concatenates each component's `import './X.css'` into dist/index.css but
  // strips the reference from the JS; the banner points back at the package's
  // layered styles.css. ../ is relative to the emitted dist/index.js.
  // sideEffects: ["*.css"] (package.json) keeps it from being tree-shaken.
  banner: { js: 'import "../styles.css";' },
  // Wrap the bundled component CSS in @layer components. Paired with the token
  // base resets in @layer base, this gives the cascade order base < components
  // < unlayered: components beat the base resets (e.g. the form-control
  // `font: inherit`), while consumer styles still override components. The
  // layer is baked into the file rather than applied via `@import ... layer()`,
  // which Next.js's CSS pipeline silently drops.
  async onSuccess() {
    const cssPath = 'dist/index.css'
    const css = await readFile(cssPath, 'utf8')
    if (css.startsWith('@layer components')) return
    await writeFile(cssPath, `@layer components {\n${css}\n}\n`, 'utf8')
  },
})
