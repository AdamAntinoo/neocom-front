import { NeoCom } from '../NeoCom';

/**
 * Front list node for distinct Solar Systems in a location hierarchy
 * (infinity `LookupSolarSystem` / `jsonClass = LookupSolarSystem`).
 * Used as the second level on the v1-blueprint-by-location page.
 */
export class SystemLookupNode extends NeoCom {
  name: string;
  blueprintsCount: number;

  constructor(values: { name?: string; blueprintsCount?: number } = {}) {
    super();
    this.jsonClass = 'LookupSolarSystem';
    this.name = values.name ?? '-';
    this.blueprintsCount = values.blueprintsCount ?? 0;
  }

  getName(): string {
    return this.name;
  }

  getBlueprintsCount(): number {
    const fromChildren = this.children.length;
    return fromChildren > 0 ? fromChildren : this.blueprintsCount;
  }
}
