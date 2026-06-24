import { LOGOS, brandColors, brandSlugs } from './brandGlyphs'

describe('brandGlyphs', () => {
  it('exposes a string path for every slug', () => {
    expect(brandSlugs).toContain('spotify')
    expect(brandSlugs.length).toBeGreaterThan(20)
    for (const s of brandSlugs) expect(typeof LOGOS[s]).toBe('string')
  })

  it('has a valid 6-digit hex color for every slug', () => {
    for (const s of brandSlugs) expect(brandColors[s]).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})
