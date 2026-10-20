/**
 * Registered UI / render variants.
 *
 * Naming: start `-`, end `-`, uppercase words separated by `-`
 * (e.g. `-DEFAULT-`, `-AVAILABLE-BLUEPRINTS-`).
 *
 * Use these constants everywhere — do not invent string literals.
 */
export enum NeoComVariant {
  DEFAULT = '-DEFAULT-',
  APP = '-APP-',
  AUTH = '-AUTH-',
  HEADER = '-HEADER-',
  AVAILABLE_BLUEPRINTS = '-AVAILABLE-BLUEPRINTS-',
}

/** All registered variant values (for validation / catalogs). */
export const NEOCOM_VARIANTS: readonly NeoComVariant[] = Object.freeze(
  Object.values(NeoComVariant).filter((v): v is NeoComVariant => typeof v === 'string'),
);
