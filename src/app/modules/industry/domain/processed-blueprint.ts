import { NeoComDelayed } from '../../innovative-core/domain/NeoComDelayed';
import type { BlueprintLocationChain } from './blueprint-location-aggregate';

/** Processed blueprint node for manufacture list renders (NODE-005, NODE-017). */
export class ProcessedBlueprint extends NeoComDelayed {
  public blueprintId: number;
  public name: string;
  public manufactureIndex: number | null;
  /** Optional location chain from NeoCom list/SSE (IND-BP-117). */
  public location?: BlueprintLocationChain;

  constructor(values: object = {}) {
    super(values);
    this.jsonClass = 'ProcessedBlueprint';
    const v = values as Partial<ProcessedBlueprint>;
    this.blueprintId = v.blueprintId ?? 0;
    this.name = v.name ?? '-';
    this.manufactureIndex = v.manufactureIndex ?? null;
    this.location = v.location;
  }

  getName(): string {
    return this.name;
  }

  getBlueprintId(): number {
    return this.blueprintId;
  }

  getManufactureIndex(): number | null {
    return this.manufactureIndex;
  }

  getLocation(): BlueprintLocationChain | undefined {
    return this.location;
  }
}

/** Summary twin registered to the same render (NODE-017). */
export class ProcessedBlueprintSummary extends ProcessedBlueprint {
  constructor(values: object = {}) {
    super(values);
    this.jsonClass = 'ProcessedBlueprintSummary';
  }
}
