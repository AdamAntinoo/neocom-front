import { NEOCOM_VARIANTS, NeoComVariant } from './NeoComVariant';

describe('NeoComVariant', () => {
  it('registers variants with -WORD- uppercase convention', () => {
    const pattern = /^-[A-Z0-9]+(?:-[A-Z0-9]+)*-$/;
    for (const value of NEOCOM_VARIANTS) {
      expect(value).toMatch(pattern);
    }
  });

  it('exposes the known variant constants', () => {
    expect(NeoComVariant.DEFAULT).toBe('-DEFAULT-');
    expect(NeoComVariant.APP).toBe('-APP-');
    expect(NeoComVariant.AUTH).toBe('-AUTH-');
    expect(NeoComVariant.HEADER).toBe('-HEADER-');
    expect(NeoComVariant.AVAILABLE_BLUEPRINTS).toBe('-AVAILABLE-BLUEPRINTS-');
  });
});
