import { NeoComDelayed } from '../../innovative-core/domain/NeoComDelayed';

/** Processed blueprint node for manufacture list renders (NODE-005, NODE-017). */
export class ProcessedBlueprint extends NeoComDelayed {
  public blueprintId = 0;
  public name = '-';
  public manufactureIndex: number | null = null;

  constructor(values: object = {}) {
    super(values);
    this.jsonClass = 'ProcessedBlueprint';
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
}

/** Summary twin registered to the same render (NODE-017). */
export class ProcessedBlueprintSummary extends ProcessedBlueprint {
  constructor(values: object = {}) {
    super(values);
    this.jsonClass = 'ProcessedBlueprintSummary';
  }
}
