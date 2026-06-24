One-line: Single-path brand/merchant logo (Spotify, Visa, PayPal…) — `currentColor` by default, official color via `brand`, sized by `size`.

```jsx
<BrandLogo name="spotify" />              {/* mono, inherits text color */}
<BrandLogo name="visa" brand size={28} /> {/* official brand color */}
<BrandLogo name="paypal" title="PayPal" /> {/* labelled, not decorative */}
```

Props: `name` (required) · `size` (px, default 20) · `brand` (use official hex; default mono via `currentColor`) · `title` (accessible label — omit for decorative, which is `aria-hidden`). Full list exported as `brandNames`; official hexes as `brandColors`. Unlike `Icon` (stroke), logos are filled glyphs. Names: `airbnb` `amex` `apple` `apple-pay` `audible` `cash-app` `coinbase` `doordash` `dropbox` `github` `google` `google-pay` `instacart` `klarna` `lyft` `mastercard` `meta` `netflix` `notion` `paypal` `playstation` `revolut` `robinhood` `spotify` `starbucks` `steam` `stripe` `uber` `uber-eats` `venmo` `visa` `wise` `x` `youtube`. Paths from Simple Icons (CC0); trademarks belong to their owners — mark a merchant/payment method, don't imply endorsement. Note: black-mark brands (apple, uber, x, steam, notion) vanish on dark backgrounds in `brand` mode — prefer mono there.
