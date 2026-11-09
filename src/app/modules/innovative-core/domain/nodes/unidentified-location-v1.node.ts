import { NeoCom } from '../NeoCom';

/**
 * Hierarchy root when spacelocations yields no region/system chain (FAL-022…025).
 * jsonClass `UnidentifiedLocationV1`. Icon deferred — render shows id + count only.
 */
export class UnidentifiedLocationV1Node extends NeoCom {
  locationId: number;

  constructor(values: { locationId?: number } | object = {}) {
    super();
    this.jsonClass = 'UnidentifiedLocationV1';
    const v = values as { locationId?: number };
    this.locationId = v.locationId ?? 0;
  }

  getLocationId(): number {
    return this.locationId;
  }

  getName(): string {
    return `Location ${this.locationId}`;
  }

  getAssetCount(): number {
    return this.getChildren().length;
  }

  override isExpandable(): boolean {
    return this.getChildren().length > 0;
  }
}
