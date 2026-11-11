/**
 * Client-side EVE Image Server URL builder (UI-MED-001…008).
 * Browser loads `images.evetech.net` directly — NeoCom back must not proxy image bytes.
 */

export type EveImageCategory = 'characters' | 'corporations' | 'alliances' | 'types';

export type EveImageVariation = 'portrait' | 'logo' | 'icon' | 'render' | 'bp';

export type EveImageOptions = {
  category: EveImageCategory;
  id?: number | null;
  variation: EveImageVariation;
  /** Power of two 32…1024; omit for original size. */
  size?: number;
  /** Defaults to `tranquility`. */
  tenant?: string;
};

const HOST = 'https://images.evetech.net';
const DEFAULT_MISSING_ID = 1;

/** Valid Image Server sizes when `size` is supplied (UI-MED-005). */
export const EVE_IMAGE_SIZES = [32, 64, 128, 256, 512, 1024] as const;

export function resolveEveImageId(id?: number | null): number {
  if (id == null || !Number.isFinite(id) || id <= 0) {
    return DEFAULT_MISSING_ID;
  }
  return Math.trunc(id);
}

export function assertEveImageSize(size: number): number {
  if (!EVE_IMAGE_SIZES.includes(size as (typeof EVE_IMAGE_SIZES)[number])) {
    throw new Error(`EVE Image Server size must be one of ${EVE_IMAGE_SIZES.join(', ')}`);
  }
  return size;
}

/**
 * Build `https://images.evetech.net/{category}/{id}/{variation}?size={size}`.
 * Missing character/corp/alliance id → `1` (UI-MED-007). Tenant defaults to tranquility (UI-MED-006).
 */
export function buildEveImageUrl(options: EveImageOptions): string {
  const id = resolveEveImageId(options.id);
  const tenant = options.tenant ?? 'tranquility';
  let url = `${HOST}/${options.category}/${id}/${options.variation}`;
  const params = new URLSearchParams();
  if (options.size != null) {
    params.set('size', String(assertEveImageSize(options.size)));
  }
  if (tenant !== 'tranquility') {
    params.set('tenant', tenant);
  }
  const query = params.toString();
  return query ? `${url}?${query}` : url;
}

export function characterPortraitUrl(characterId?: number | null, size = 64): string {
  return buildEveImageUrl({ category: 'characters', id: characterId, variation: 'portrait', size });
}

export function corporationLogoUrl(corporationId?: number | null, size = 64): string {
  return buildEveImageUrl({ category: 'corporations', id: corporationId, variation: 'logo', size });
}

export function allianceLogoUrl(allianceId?: number | null, size = 64): string {
  return buildEveImageUrl({ category: 'alliances', id: allianceId, variation: 'logo', size });
}

export function typeIconUrl(typeId?: number | null, size = 32): string {
  return buildEveImageUrl({ category: 'types', id: typeId, variation: 'icon', size });
}

export function typeRenderUrl(typeId?: number | null, size = 64): string {
  return buildEveImageUrl({ category: 'types', id: typeId, variation: 'render', size });
}

export function typeBlueprintUrl(typeId?: number | null, size = 64): string {
  return buildEveImageUrl({ category: 'types', id: typeId, variation: 'bp', size });
}
