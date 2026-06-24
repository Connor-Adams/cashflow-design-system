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
})
