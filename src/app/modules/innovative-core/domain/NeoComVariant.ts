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
  /** Public pilot panel / render (PANEL-006). */
  PILOT_PUBLIC = '-PILOT-PUBLIC-VARIANT-',
  /** Private pilot panel complementing public data (PANEL-007). */
  PILOT = '-PILOT-VARIANT-',
  /** Pilot listing row; partial fields (PANEL-008). */
  PILOT_LIST = '-PILOT-LIST-VARIANT-',
  /** Region / solar-system lookup cards (`v1-region`, …). */
  SOLAR_SYSTEM_LOOKUP = '-SOLAR-SYSTEM-LOOKUP-',
}

/** All registered variant values (for validation / catalogs). */
export const NEOCOM_VARIANTS: readonly NeoComVariant[] = Object.freeze(
  Object.values(NeoComVariant).filter((v): v is NeoComVariant => typeof v === 'string'),
);
