---
"@connor-adams/designsystem": minor
---

Styles now load automatically — `import { Button } from '@connor-adams/designsystem'` pulls in the bundled CSS (tokens included) via a side-effect import on the JS entry. The separate `import '@connor-adams/designsystem/styles.css'` line is no longer required (the export is kept for back-compat). Requires a consumer bundler that processes CSS from `node_modules`.
