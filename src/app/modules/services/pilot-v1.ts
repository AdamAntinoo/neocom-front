export interface AllianceV1 {
  allianceId?: number;
  name?: string;
  ticker?: string;
  url4Icon?: string;
}

export interface PublicCorporationV1 {
  corporationId?: number;
  name?: string;
  ceoid?: number;
  creatorId?: number;
  dateFounded?: string;
  description?: string;
  homeStation?: object;
  memberCount?: number;
  shares?: number;
  taxRate?: number;
  ticker?: string;
  url4Icon?: string;
  allianceId?: number;
  alliance?: AllianceV1;
}

export interface UniverseRaceDataV1 {
  allianceId?: number;
  description?: string;
  name?: string;
  raceId?: number;
}

export interface UniverseAncestryDataV1 {
  name?: string;
}

export interface UniverseBloodlineDataV1 {
  name?: string;
}

/** Pilot returned by neocom-back `GET /v1/pilots/{pilotId}`. */
export interface PilotV1 {
  pilotId: number;
  name?: string;
  corporation?: PublicCorporationV1;
  birthday?: string;
  description?: string;
  gender?: string;
  securityStatus?: number;
  url4Icon?: string;
  raceData?: UniverseRaceDataV1;
  ancestryData?: UniverseAncestryDataV1;
  bloodlineData?: UniverseBloodlineDataV1;
  totalSkillpoints?: number;
  walletBalance?: number;
  currentShipName?: string;
  currentShipTypeName?: string;
  lastKnownLocation?: object;
}
