The statement-import target for the import flow — drag-and-drop or click-to-browse a CSV/OFX file.

```jsx
<ImportDropzone onFile={(f) => parseStatement(f)} />
```

Accepts via the `accept` prop (default `.csv,.ofx,.qfx`). Presentational — it surfaces the file and highlights on drag; you own the parse.
