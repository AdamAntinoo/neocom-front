import { BlueprintV1 } from 'neocom-domain';
import { NeoCom } from '../NeoCom';

/**
 * Front render node for published {@link BlueprintV1}.
 * Domain `Record` stays the wire model; this NeoCom subclass is what enters collaborate2View / registry.
 */
export class BlueprintV1Node extends NeoCom {
  private readonly record: BlueprintV1;

  constructor(source: BlueprintV1 | object = {}) {
    super();
    this.record = source instanceof BlueprintV1 ? source : new BlueprintV1(source);
    this.jsonClass = 'BlueprintV1';
  }

  static from(record: BlueprintV1): BlueprintV1Node {
    return new BlueprintV1Node(record);
  }

  getRecord(): BlueprintV1 {
    return this.record;
  }

  getBlueprintId(): number {
    return this.record.getBlueprintId();
  }

  getBlueprintTypeId(): number {
    return this.record.getBlueprintTypeId();
  }

  getBlueprintTypeName(): string {
    return this.record.getBlueprintTypeName();
  }

  getBlueprintTypeIconURL(): string {
    return this.record.getBlueprintTypeIconURL();
  }

  getOutputTypeId(): number {
    return this.record.getOutputTypeId();
  }

  getOutputTypeName(): string {
    return this.record.getOutputTypeName();
  }

  getOutputTypeIconURL(): string {
    return this.record.getOutputTypeIconURL();
  }

  getRuns(): number {
    return this.record.getRuns();
  }

  getMaterialEfficiency(): number {
    return this.record.getMaterialEfficiency();
  }

  getTimeEfficiency(): number {
    return this.record.getTimeEfficiency();
  }

  getMaxRuns(): number {
    return this.record.getMaxRuns();
  }
}
