import type { IconName } from '../core/Icon'

/**
 * Infers a sensible icon + tint for a free-text transaction category or
 * merchant name. Real-world categories are messy ("Eating Out", "cc fees",
 * "Spotify", "Office Equipment") — an exact-key lookup only ever matches a
 * handful, so this does ordered keyword matching against the icon registry.
 *
 * Rules are tried top-to-bottom, first match wins; brand/merchant names come
 * before generic categories so "Apple" reads as a device, not produce, and
 * "Amazon" as a parcel, not generic shopping. Falls back to a neutral tag.
 */
export interface CategoryVisual {
  icon: IconName
  tint: string
}

// Semantic tint buckets — reuse the token palette already wired into the theme
// rather than inventing per-icon colors.
const T = {
  food: 'var(--gradient-hero-from)',
  vice: 'var(--oxblood-400)',
  income: 'var(--positive)',
  physical: 'var(--chart-steel)',
  digital: 'var(--gradient-hero-to)',
  energy: 'var(--amber-w-500)',
  fee: 'var(--destructive)',
  muted: 'var(--muted-foreground)',
} as const

const DEFAULT: CategoryVisual = { icon: 'tag', tint: T.muted }

// [matcher, icon, tint]. Matched against the normalized (lowercased,
// punctuation-stripped, space-padded) category string.
const RULES: ReadonlyArray<readonly [RegExp, IconName, string]> = [
  // --- brands & merchants (ambiguous → resolve before generic words) --------
  [/\bamazon\b/, 'package', T.physical],
  [/\b(spotify|tidal|pandora|apple music)\b/, 'music', T.digital],
  [/\b(netflix|hulu|disney|hbo|crave|prime video|youtube)\b/, 'tv', T.digital],
  [/\b(sephora|ulta)\b/, 'lipstick', T.vice],
  [/\b(apple|icloud|iphone)\b/, 'smartphone', T.digital],
  [/\b(openai|anthropic|chatgpt|claude|midjourney|copilot|gpt)\b/, 'sparkles', T.digital],
  [/\b(google|microsoft|adobe|dropbox|notion|slack|figma|github)\b/, 'monitor', T.digital],
  [/\b(uber eats|doordash|skip|grubhub|deliveroo)\b/, 'utensils', T.vice],
  [/\b(uber|lyft)\b/, 'car', T.physical],
  [/\b(airbnb|expedia|marriott|hilton)\b/, 'bed', T.physical],
  [/\b(steam|playstation|xbox|nintendo|epic games)\b/, 'gamepad-2', T.digital],
  [/\b(clublink|golf)\b/, 'flag', T.physical],
  [/\b(zara|nike|adidas|uniqlo|biba|lululemon)\b/, 'shirt', T.physical],
  [/\b(rogers|telus|bell|fido|koodo|verizon|at&t)\b/, 'smartphone', T.digital],

  // --- income & money movement ----------------------------------------------
  [/\b(income|salary|payroll|paycheck|paycheque|wages|deposit|refund|reimburse)\b/, 'trending-up', T.income],
  [/\b(saving|invest|investment|stocks|brokerage|dividend|rrsp|tfsa|401k)\b/, 'piggy-bank', T.income],

  // --- housing ---------------------------------------------------------------
  [/\b(rent|mortgage|landlord)\b/, 'home', T.physical],
  [/\b(furniture|ikea|household|home goods)\b/, 'sofa', T.physical],

  // --- food & drink ----------------------------------------------------------
  [/\b(grocer|groceries|supermarket|costco|whole foods|food basics)\b/, 'shopping-cart', T.food],
  [/\b(coffee|starbucks|espresso|tim hortons|cafe)\b/, 'coffee', T.vice],
  [/\b(restaurant|dining|eat|eating|dine|brunch|lunch|dinner|takeout|food)\b/, 'utensils', T.vice],
  [/\b(alcohol|liquor|wine|beer|bar|pub|lcbo|booze|brewery)\b/, 'wine', T.vice],

  // --- vices -----------------------------------------------------------------
  [/\b(weed|cannabis|dispensary|marijuana)\b/, 'leaf', T.vice],
  [/\b(vape|nicotine|juul)\b/, 'vape', T.vice],
  [/\b(cigarette|tobacco|smoke)\b/, 'flame', T.vice],

  // --- transport -------------------------------------------------------------
  [/\b(gas|fuel|petrol|gasoline|shell|esso|petro)\b/, 'fuel', T.physical],
  [/\bparking\b/, 'parking-square', T.physical],
  [/\b(transit|subway|metro|train|rail|go train)\b/, 'train', T.physical],
  [/\bbus\b/, 'bus', T.physical],
  [/\b(flight|airline|airfare|plane|travel|vacation|trip)\b/, 'plane', T.physical],
  [/\b(bike|cycling|bicycle)\b/, 'bike', T.physical],
  [/\b(car|auto|vehicle)\b/, 'car', T.physical],

  // --- connectivity & digital ------------------------------------------------
  [/\b(internet|wifi|broadband|isp)\b/, 'wifi', T.digital],
  [/\b(hosting|server|cloud|aws|vps|domain|vercel|railway)\b/, 'server', T.digital],
  [/\b(phone|mobile|cellular|wireless)\b/, 'smartphone', T.digital],
  [/\b(ai|llm|ml)\b/, 'sparkles', T.digital],
  [/\b(software|saas|app|license|subscription)\b/, 'monitor', T.digital],

  // --- utilities -------------------------------------------------------------
  [/\b(electric|hydro|power)\b/, 'zap', T.energy],
  [/\bwater\b/, 'droplet', T.energy],
  [/\b(heat|heating|furnace)\b/, 'flame', T.energy],
  [/\b(utility|utilities|bill)\b/, 'zap', T.energy],

  // --- entertainment & media -------------------------------------------------
  [/\b(streaming|video)\b/, 'tv', T.digital],
  [/\b(movie|cinema|theatre|theater)\b/, 'film', T.digital],
  [/\b(game|gaming)\b/, 'gamepad-2', T.digital],
  [/\b(book|kindle|audible|reading)\b/, 'book-open', T.digital],
  [/\b(music|audio)\b/, 'music', T.digital],
  [/\b(ticket|event|concert|show)\b/, 'ticket', T.digital],

  // --- health & body ---------------------------------------------------------
  [/\b(dental|dentist|teeth|tooth)\b/, 'tooth', T.physical],
  [/\b(diabetes|insulin|glucose)\b/, 'heart-pulse', T.physical],
  [/\b(pharmacy|prescription|drug|medical|doctor|clinic|hospital|health)\b/, 'pill', T.physical],
  [/\b(therapy|mental|wellness)\b/, 'heart', T.physical],
  [/\b(gym|fitness|workout|crossfit|peloton)\b/, 'dumbbell', T.physical],

  // --- shopping & personal ---------------------------------------------------
  [/\b(beauty|cosmetic|makeup|salon|spa|nails|hair|barber)\b/, 'lipstick', T.vice],
  [/\b(jewelry|jewellery|watch)\b/, 'gem', T.vice],
  [/\b(clothing|clothes|apparel|fashion|shoes|outfit)\b/, 'shirt', T.physical],
  [/\b(electronics|gadget|computer|laptop)\b/, 'laptop', T.digital],
  [/\b(office|equipment|supplies|stationery|printer)\b/, 'briefcase', T.physical],
  [/\b(shopping|retail|store|mall)\b/, 'shopping-bag', T.physical],

  // --- life ------------------------------------------------------------------
  [/\b(education|tuition|school|course|udemy|coursera)\b/, 'graduation-cap', T.digital],
  [/\b(pet|dog|cat|vet|veterinary)\b/, 'paw-print', T.physical],
  [/\b(baby|child|kids|daycare|diaper)\b/, 'baby', T.physical],
  [/\b(gift|present|donation|charity)\b/, 'gift', T.physical],
  [/\binsurance\b/, 'shield', T.physical],
  [/\b(garden|plant|flower|nursery)\b/, 'flower-2', T.physical],
  [/\b(hardware|tools|repair|renovation|maintenance)\b/, 'wrench', T.physical],

  // --- money out: fees, tax, banking ----------------------------------------
  [/\b(tax|taxes|cra|irs)\b/, 'landmark', T.fee],
  [/\b(accounting|bookkeeping|accountant)\b/, 'calculator', T.fee],
  [/\b(cc|credit card|card payment)\b/, 'credit-card', T.fee],
  [/\b(fee|fees|charge|interest|overdraft|atm)\b/, 'percent', T.fee],
  [/\b(bank|banking|transfer|withdrawal)\b/, 'landmark', T.physical],

  // --- explicit no-category --------------------------------------------------
  [/\b(uncategorized|uncategorised|misc|other|unknown|default)\b/, 'help-circle', T.muted],
]

/**
 * App-supplied overrides, keyed by category/merchant name (matched
 * case/punctuation-insensitively). A bare {@link IconName} swaps the icon and
 * keeps the inferred tint; a full {@link CategoryVisual} sets both. This is the
 * seam for a stored "icon per category" in the consuming app — keyword
 * inference is only the default suggestion.
 */
export type CategoryOverrides = Record<string, IconName | CategoryVisual>

/** Lowercase, replace punctuation with spaces, collapse, and pad for `\b`. */
function normalize(category: string): string {
  return ` ${category.toLowerCase().replace(/[^a-z0-9&]+/g, ' ').replace(/\s+/g, ' ').trim()} `
}

function pickOverride(overrides: CategoryOverrides, text: string): IconName | CategoryVisual | undefined {
  for (const key in overrides) {
    if (normalize(key) === text) return overrides[key]
  }
  return undefined
}

/** Resolve a free-text category/merchant to its icon + tint. */
export function categoryVisual(
  category: string | undefined | null,
  overrides?: CategoryOverrides,
): CategoryVisual {
  if (!category) return DEFAULT
  const text = normalize(category)

  let result = DEFAULT
  for (const [matcher, icon, tint] of RULES) {
    if (matcher.test(text)) {
      result = { icon, tint }
      break
    }
  }

  // App overrides win — and win even when no keyword rule matched.
  const ov = overrides && pickOverride(overrides, text)
  if (ov) result = typeof ov === 'string' ? { ...result, icon: ov } : ov

  return result
}

/** Just the icon name for a category — convenience over {@link categoryVisual}. */
export function categoryIconName(
  category: string | undefined | null,
  overrides?: CategoryOverrides,
): IconName {
  return categoryVisual(category, overrides).icon
}
