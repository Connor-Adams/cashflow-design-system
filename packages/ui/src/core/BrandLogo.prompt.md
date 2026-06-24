One-line: Single-path brand/merchant logo (Spotify, Visa, PayPal…) — `currentColor` by default, official color via `brand`, sized by `size`.

```jsx
<BrandLogo name="spotify" />              {/* mono, inherits text color */}
<BrandLogo name="visa" brand size={28} /> {/* official brand color */}
<BrandLogo name="paypal" title="PayPal" /> {/* labelled, not decorative */}
```

Props: `name` (required) · `size` (px, default 20) · `brand` (use official hex; default mono via `currentColor`) · `title` (accessible label — omit for decorative, which is `aria-hidden`). Full list exported as `brandNames`; official hexes as `brandColors`. Unlike `Icon` (stroke), logos are filled glyphs. ~230 brands across payments/fintech (`visa` `mastercard` `amex` `paypal` `venmo` `cash-app` `stripe` `klarna` `coinbase` `revolut` `wise`…), streaming (`spotify` `netflix` `youtube` `apple-music` `tidal` `twitch`…), food/delivery (`mcdonalds` `starbucks` `doordash` `uber-eats` `deliveroo`…), travel (`airbnb` `booking` `uber` `lyft` `expedia`…), retail (`ebay` `etsy` `shopify` `nike` `ikea`…), and tech (`google` `apple` `meta` `github` `figma` `notion`…). Enumerate the full set via `brandNames` (`import { brandNames }`); per-brand hexes in `brandColors`. Paths from Simple Icons (CC0); trademarks belong to their owners — mark a merchant/payment method, don't imply endorsement. Note: black-mark brands (apple, uber, x, steam, notion) vanish on dark backgrounds in `brand` mode — prefer mono there.
