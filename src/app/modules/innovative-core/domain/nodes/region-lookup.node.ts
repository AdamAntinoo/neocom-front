import { NeoCom } from '../NeoCom';

/**
 * Front list node for distinct Regions in a location hierarchy
 * (infinity `LookupRegion` / `jsonClass = LookupRegion`).
 * Used as the first level on the v1-blueprint-by-location page.
 */
export class RegionLookupNode extends NeoCom {
  name: string;
  systemsCount: number;

  constructor(values: { name?: string; systemsCount?: number } = {}) {
    super();
    this.jsonClass = 'LookupRegion';
    this.name = values.name ?? '-';
    this.systemsCount = values.systemsCount ?? 0;
  }

  getName(): string {
    return this.name;
  }

  getSystemsCount(): number {
    const fromChildren = this.children.length;
    return fromChildren > 0 ? fromChildren : this.systemsCount;
  }
}
