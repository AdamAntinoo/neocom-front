import { PilotV2, PublicPilotV1 } from 'neocom-domain';

/** Loose wire shape for pilot JSON (no longer a published front DTO). */
export type PilotWire = {
  jsonClass?: string;
  pilotId: number;
  name?: string;
  birthday?: string;
  description?: string;
  gender?: string;
  securityStatus?: number;
  url4Icon?: string;
  corporation?: {
    corporationId?: number;
    name?: string;
    alliance?: { allianceId?: number; name?: string };
  };
  raceData?: { name?: string };
  ancestryData?: { name?: string };
  bloodlineData?: { name?: string };
  totalSkillpoints?: number;
  walletBalance?: number;
  currentShipName?: string;
  currentShipTypeName?: string;
};

/**
 * Prefer wire `jsonClass` when present (DOM-JSONCLASS-002).
 * Fallback for legacy payloads without jsonClass: private fields ⇒ PilotV2.
 */
export function isAuthenticatedPilotDto(dto: PilotWire): boolean {
  if (dto.jsonClass === 'PilotV2') {
    return true;
  }
  if (dto.jsonClass === 'PublicPilotV1') {
    return false;
  }
  return (
    dto.totalSkillpoints !== undefined ||
    dto.walletBalance !== undefined ||
    dto.currentShipName !== undefined
  );
}

function publicFields(dto: PilotWire): object {
  return {
    pilotId: dto.pilotId,
    name: dto.name ?? '',
    corporation: dto.corporation
      ? { corporationId: dto.corporation.corporationId, name: dto.corporation.name }
      : undefined,
    birthday: dto.birthday ?? '',
    description: dto.description ?? '',
    gender: dto.gender ?? '',
    securityStatus: dto.securityStatus ?? 0,
    url4Icon: dto.url4Icon ?? '',
    raceData: dto.raceData ? { name: dto.raceData.name ?? '' } : undefined,
    ancestryData: dto.ancestryData ? { name: dto.ancestryData.name ?? '' } : undefined,
    bloodlineData: dto.bloodlineData ? { name: dto.bloodlineData.name ?? '' } : undefined,
  };
}

/** Map back pilot JSON → PublicPilotV1 (public HEADER). */
export function publicPilotFromDto(dto: PilotWire): PublicPilotV1 {
  return new PublicPilotV1(publicFields(dto));
}

/** Map back pilot JSON → PilotV2 (authenticated HEADER). */
export function pilotV2FromDto(dto: PilotWire): PilotV2 {
  return new PilotV2({
    ...publicFields(dto),
    totalSkillpoints: dto.totalSkillpoints ?? 0,
    walletBalance: dto.walletBalance ?? 0,
    currentShipName: dto.currentShipName ?? '',
    currentShipTypeName: dto.currentShipTypeName ?? '',
    alliance: dto.corporation?.alliance
      ? { allianceId: dto.corporation.alliance.allianceId, name: dto.corporation.alliance.name }
      : undefined,
  });
}

/**
 * Build the programme domain record from a pilot payload.
 * Uses `jsonClass` when present; does not infer type from the request URL.
 */
export function pilotFromDto(dto: PilotWire): PublicPilotV1 | PilotV2 {
  return isAuthenticatedPilotDto(dto) ? pilotV2FromDto(dto) : publicPilotFromDto(dto);
}

/** Compact ISK for v2-pilot HEADER (e.g. 2.77B ISK). */
export function formatIskScaled(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000_000) {
    return `${(amount / 1_000_000_000_000).toFixed(2)}T ISK`;
  }
  if (abs >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2)}B ISK`;
  }
  if (abs >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M ISK`;
  }
  if (abs >= 1_000) {
    return `${(amount / 1_000).toFixed(2)}K ISK`;
  }
  return `${amount.toFixed(2)} ISK`;
}
