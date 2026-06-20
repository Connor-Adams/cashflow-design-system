import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  // Inline the tokens CSS into dist/index.css instead of leaving it as a runtime
  // import (tsup externalizes deps by default). Keeps styling to one stylesheet.
  noExternal: ['@connor-adams/tokens'],
  // Re-attach the bundled CSS to the JS entry. tsup concatenates every
  // `import './X.css'` into dist/index.css but strips the reference from the JS;
  // this banner puts it back so importing the package drags its styles in.
  // sideEffects: ["*.css"] keeps it from being tree-shaken away.
  banner: { js: 'import "./index.css";' },
})
