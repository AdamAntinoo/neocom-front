import { PilotV2, PublicPilotV1 } from 'neocom-domain';
import { PublicPilotV1Node } from './public-pilot-v1.node';

/** Front render / panel node for published {@link PilotV2}. */
export class PilotV2Node extends PublicPilotV1Node {
  declare protected readonly record: PilotV2;

  constructor(source: PilotV2 | object = {}) {
    const record = source instanceof PilotV2 ? source : new PilotV2(source);
    super(record);
    this.jsonClass = 'PilotV2';
  }

  static override from(record: PublicPilotV1 | PilotV2): PilotV2Node {
    return new PilotV2Node(record instanceof PilotV2 ? record : new PilotV2(record));
  }

  override getRecord(): PilotV2 {
    return this.record;
  }

  getWalletBalance(): number {
    return this.record.getWalletBalance();
  }

  getTotalSkillpoints(): number {
    return this.record.getTotalSkillpoints();
  }

  getCurrentShipName(): string {
    return this.record.getCurrentShipName();
  }

  getCurrentShipTypeName(): string {
    return this.record.getCurrentShipTypeName();
  }

  getLastKnownLocation(): string {
    return this.record.getLastKnownLocation();
  }
}
