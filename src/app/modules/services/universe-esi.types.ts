/** ESI Universe list/detail shapes used by UNIV-002 (snake_case wire). */

export type UniverseAncestry = {
  id: number;
  name: string;
  bloodline_id: number;
  description: string;
  icon_id?: number;
  short_description?: string;
};

export type UniverseBloodline = {
  bloodline_id: number;
  name: string;
  race_id: number;
  description: string;
  corporation_id: number;
  ship_type_id: number | null;
  charisma: number;
  intelligence: number;
  memory: number;
  perception: number;
  willpower: number;
};

export type UniverseFaction = {
  faction_id: number;
  name: string;
  description: string;
  is_unique: boolean;
  size_factor: number;
  station_count: number;
  station_system_count: number;
  corporation_id?: number;
  militia_corporation_id?: number;
  solar_system_id?: number;
};

/** Graphic id from `GET /universe/graphics/`. */
export type UniverseGraphicId = number;

export type UniverseGroupSummary = {
  group_id: number;
  name: string;
  category_id: number;
  published: boolean;
  types: number[];
};

export type UniverseCategorySummary = {
  category_id: number;
  name: string;
  published: boolean;
  groups: number[];
};

/** Pilot character ids that Universe lists explain (UNIV-002). */
export type PilotUniverseIds = {
  ancestryId?: number;
  bloodlineId?: number;
  factionId?: number;
};

export type PilotUniverseResolved = {
  ancestry?: UniverseAncestry;
  bloodline?: UniverseBloodline;
  faction?: UniverseFaction;
};
