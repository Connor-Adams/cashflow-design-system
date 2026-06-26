import { categoryVisual, categoryIconName } from './categoryIcon'

describe('categoryVisual', () => {
  // The set from the live "Net spend by category" tile that motivated this —
  // previously every one but Groceries fell to the default glyph.
  it.each([
    ['(uncategorized)', 'help-circle'],
    ['Rent', 'home'],
    ['Amazon', 'package'],
    ['Household', 'sofa'],
    ['Eating Out', 'utensils'],
    ['Office Equipment', 'briefcase'],
    ['Groceries', 'shopping-cart'],
    ['Ai', 'sparkles'],
    ['Weed', 'leaf'],
    ['Sephora', 'lipstick'],
    ['Diabetes', 'heart-pulse'],
    ['Apple', 'smartphone'],
    ['Internet', 'wifi'],
    ['Vape', 'vape'],
    ['cc fees', 'credit-card'],
    ['Alcohol', 'wine'],
    ['Gas', 'fuel'],
    ['Accounting', 'calculator'],
    ['Spotify', 'music'],
    ['Hosting', 'server'],
    ['Clublink', 'flag'],
    ['Golf', 'flag'],
    ['Clothing', 'shirt'],
    ['Dentist', 'tooth'],
    ['Games', 'gamepad-2'],
    ['Subscriptions', 'monitor'],
    ['Biba', 'shirt'],
    // Multi-word merchant name — must match despite the space.
    ['LuLu Lemon', 'shirt'],
  ])('maps %s → %s', (category, icon) => {
    expect(categoryIconName(category)).toBe(icon)
  })

  it('falls back to a neutral tag for unknown categories', () => {
    expect(categoryIconName('Zorblax Enterprises')).toBe('tag')
  })

  it('handles empty / nullish input', () => {
    expect(categoryIconName('')).toBe('tag')
    expect(categoryIconName(undefined)).toBe('tag')
    expect(categoryIconName(null)).toBe('tag')
  })

  it('is case- and punctuation-insensitive', () => {
    expect(categoryIconName('EATING-OUT')).toBe('utensils')
    expect(categoryIconName('  spotify  ')).toBe('music')
  })

  it('returns a tint token alongside the icon', () => {
    expect(categoryVisual('Groceries').tint).toMatch(/^var\(--/)
  })

  describe('overrides', () => {
    it('a bare icon-name override swaps the icon, keeps the inferred tint', () => {
      const groceriesTint = categoryVisual('Groceries').tint
      const v = categoryVisual('Groceries', { Groceries: 'store' })
      expect(v.icon).toBe('store')
      expect(v.tint).toBe(groceriesTint)
    })

    it('a full visual override sets icon and tint', () => {
      const v = categoryVisual('Clublink', { Clublink: { icon: 'trophy', tint: 'var(--positive)' } })
      expect(v).toEqual({ icon: 'trophy', tint: 'var(--positive)' })
    })

    it('wins even when no keyword rule matched', () => {
      expect(categoryIconName('Zorblax', { Zorblax: 'rocket' })).toBe('rocket')
    })

    it('matches override keys case/punctuation-insensitively', () => {
      expect(categoryIconName('CLUB-LINK', { 'club link': 'trophy' })).toBe('trophy')
    })

    it('ignores overrides that do not match the category', () => {
      expect(categoryIconName('Groceries', { Rent: 'home' })).toBe('shopping-cart')
    })
  })
})
