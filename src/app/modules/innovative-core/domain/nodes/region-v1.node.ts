import { NeoCom } from '../NeoCom';

/**
 * Front NeoCom for Region (DEF-BLP-007…009, 012).
 * Hierarchy counts come from {@link NeoCom.getChildren} — no Lookup/Listing subclass.
 */
export class RegionV1Node extends NeoCom {
  name: string;
  regionId?: number;

  constructor(values: { name?: string; regionId?: number } = {}) {
    super();
    this.jsonClass = 'RegionV1';
    this.name = values.name ?? '-';
    this.regionId = values.regionId;
  }

  getName(): string {
    return this.name;
  }

  /** Distinct solar-system children under this region. */
  getSystemsCount(): number {
    return this.getChildren().length;
  }
}
