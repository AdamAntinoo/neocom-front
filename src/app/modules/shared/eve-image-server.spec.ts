import {
  buildEveImageUrl,
  characterPortraitUrl,
  corporationLogoUrl,
  resolveEveImageId,
} from './eve-image-server';

describe('eve-image-server', () => {
  it('builds corporation logo URLs with size', () => {
    expect(corporationLogoUrl(98477920, 64)).toBe(
      'https://images.evetech.net/corporations/98477920/logo?size=64',
    );
  });

  it('uses id 1 when character id is missing', () => {
    expect(resolveEveImageId(undefined)).toBe(1);
    expect(characterPortraitUrl(null, 64)).toBe(
      'https://images.evetech.net/characters/1/portrait?size=64',
    );
  });

  it('omits size when not supplied', () => {
    expect(buildEveImageUrl({ category: 'types', id: 25601, variation: 'icon' })).toBe(
      'https://images.evetech.net/types/25601/icon',
    );
  });

  it('rejects non power-of-two sizes outside the table', () => {
    expect(() =>
      buildEveImageUrl({ category: 'characters', id: 1, variation: 'portrait', size: 48 }),
    ).toThrow();
  });
});
