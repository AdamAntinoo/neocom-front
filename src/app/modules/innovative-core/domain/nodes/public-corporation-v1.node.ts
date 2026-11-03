import { NeoCom } from '../NeoCom';

/** Enriched public corporation wire for HEADER render (EPIC-006 UI-CORP). */
export type PublicCorporationWire = {
  corporationId?: number;
  name?: string;
  ticker?: string;
  memberCount?: number;
  taxRate?: number;
  allianceId?: number;
  allianceName?: string;
  homeStationId?: number;
  /** Pre-built `name >> system >> constellation >> region`. */
  homeLocationPath?: string;
};

/**
 * Front render node for corporation public data + alliance / home enrichments.
 * ESI payloads stay server-internal; this node is what the render reads.
 */
export class PublicCorporationV1Node extends NeoCom {
  private readonly wire: PublicCorporationWire;

  constructor(source: PublicCorporationWire = {}) {
    super();
    this.wire = { ...source };
    this.jsonClass = 'PublicCorporationV1';
  }

  static from(source: PublicCorporationWire): PublicCorporationV1Node {
    return new PublicCorporationV1Node(source);
  }

  getCorporationId(): number {
    return this.wire.corporationId ?? 0;
  }

  getName(): string {
    return this.wire.name ?? '';
  }

  getTicker(): string {
    return this.wire.ticker ?? '';
  }

  getMemberCount(): number {
    return this.wire.memberCount ?? 0;
  }

  /** ESI tax_rate 0…1 as whole-number percent string (e.g. `5%`). */
  getTaxRatePercent(): string {
    const rate = this.wire.taxRate;
    if (rate == null || Number.isNaN(rate)) {
      return '';
    }
    return `${Math.round(rate * 100)}%`;
  }

  getAllianceId(): number | undefined {
    return this.wire.allianceId;
  }

  getAllianceName(): string {
    return this.wire.allianceName ?? '';
  }

  hasAlliance(): boolean {
    return (this.wire.allianceId ?? 0) > 0 && this.getAllianceName().length > 0;
  }

  getHomeStationId(): number | undefined {
    return this.wire.homeStationId;
  }

  getHomeLocationPath(): string {
    return this.wire.homeLocationPath ?? '';
  }

  hasHomeLocation(): boolean {
    return (this.wire.homeStationId ?? 0) > 0 && this.getHomeLocationPath().length > 0;
  }

  getCorporationIcon(): string {
    const id = this.getCorporationId() > 0 ? this.getCorporationId() : 1;
    return `https://images.evetech.net/corporations/${id}/logo?size=64`;
  }
}
