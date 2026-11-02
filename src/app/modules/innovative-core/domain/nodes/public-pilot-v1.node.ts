import {
  PublicPilotV1,
  type PilotNameSummary,
  type PublicCorporationSummary,
} from 'neocom-domain';
import { NeoCom } from '../NeoCom';

type PilotWire = {
  birthday?: string;
  gender?: string;
  securityStatus?: number;
  description?: string;
  corporation?: PublicCorporationSummary & {
    ticker?: string;
    alliance?: { name?: string };
  };
  raceData?: PilotNameSummary;
  ancestryData?: PilotNameSummary;
  bloodlineData?: PilotNameSummary;
};

/**
 * Front render / panel node for published {@link PublicPilotV1}.
 * Wire fields not yet exposed as domain getters are mirrored for the panel.
 */
export class PublicPilotV1Node extends NeoCom {
  protected readonly record: PublicPilotV1;
  private readonly wire: PilotWire;

  constructor(source: PublicPilotV1 | object = {}) {
    super();
    this.record = source instanceof PublicPilotV1 ? source : new PublicPilotV1(source);
    this.wire = (source instanceof PublicPilotV1 ? source : source) as PilotWire;
    this.jsonClass = 'PublicPilotV1';
  }

  static from(record: PublicPilotV1): PublicPilotV1Node {
    return new PublicPilotV1Node(record);
  }

  getRecord(): PublicPilotV1 {
    return this.record;
  }

  getPilotId(): number {
    return this.record.getPilotId();
  }

  getName(): string {
    return this.record.getName();
  }

  getGender(): string {
    return this.record.getGender();
  }

  getGenderDisplay(): string {
    return this.record.getGenderDisplay();
  }

  getAncestryLine(): string {
    return this.record.getAncestryLine();
  }

  getPilotIcon(): string {
    return this.record.getPilotIcon();
  }

  getBirthday(): string {
    return this.wire.birthday ?? '';
  }

  getSecurityStatus(): number {
    return this.wire.securityStatus ?? 0;
  }

  getDescription(): string {
    return this.wire.description ?? '';
  }

  getCorporationName(): string {
    return this.wire.corporation?.name ?? '';
  }

  getCorporationTicker(): string {
    return this.wire.corporation?.ticker ?? '';
  }

  getAllianceName(): string {
    return this.wire.corporation?.alliance?.name ?? '';
  }

  getRaceName(): string {
    return this.wire.raceData?.name ?? '';
  }

  getBloodlineName(): string {
    return this.wire.bloodlineData?.name ?? '';
  }

  getAncestryName(): string {
    return this.wire.ancestryData?.name ?? '';
  }
}
