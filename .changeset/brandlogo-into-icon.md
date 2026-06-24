---
"@connor-adams/designsystem": major
---

Remove `BrandLogo`; brand/merchant marks now ship through `Icon`.

Brand logos are addressed with a `brand:` name prefix — `<Icon name="brand:spotify" />`, or `<Icon name="brand:visa" brand />` for the official color. The `brand` boolean moved onto `Icon` (no-op on stroke glyphs), and `iconNames` now includes the `brand:`-prefixed names.

**Breaking:** the `BrandLogo` component and the `brandNames`, `brandColors`, `BrandName`, and `BrandLogoProps` exports are removed. Migrate `<BrandLogo name="spotify" brand />` → `<Icon name="brand:spotify" brand />`. Brand marks now render with `data-slot="icon"` (was `data-slot="brand-logo"`) and the `.ca-icon` class (was `.ca-brand-logo`) — update any CSS/test selectors targeting the old values.
