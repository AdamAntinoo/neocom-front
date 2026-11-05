import { NeoCom } from '../NeoCom';
import { SpaceLocationNodeV1, type SpaceLocationV1DtoWire } from './space-location-v1.node';

/** Wire shape for `BlueprintV1Dto` (BLP-007 / BLP-013). */
export type BlueprintV1DtoWire = {
  jsonClass?: string;
  id?: number;
  blueprintId?: number;
  blueprintTypeId?: number;
  blueprintTypeName?: string;
  blueprintTypeIconURL?: string;
  name?: string;
  ready?: boolean;
  manufactureIndex?: number | null;
  runs?: number;
  materialEfficiency?: number;
  timeEfficiency?: number;
  maxRuns?: number;
  locationId?: number;
  locationFlag?: string;
  location?: SpaceLocationV1DtoWire;
};

/**
 * Hierarchy leaf for blueprint-by-location (BLP-007).
 * Always a NeoCom domain model from the provider (BLP-013).
 */
export class BlueprintNodeV1 extends NeoCom {
  blueprintId: number;
  blueprintTypeId: number;
  blueprintTypeName: string;
  blueprintTypeIconURL: string;
  runs: number;
  materialEfficiency: number;
  timeEfficiency: number;
  maxRuns: number;
  /** Tied SpaceLocation for aggregation keys (BLP-017). */
  spaceLocation?: SpaceLocationNodeV1;

  constructor(values: BlueprintV1DtoWire | object = {}) {
    super();
    this.jsonClass = 'BlueprintNodeV1';
    const v = values as BlueprintV1DtoWire;
    this.blueprintId = v.blueprintId ?? v.id ?? 0;
    this.blueprintTypeId = v.blueprintTypeId ?? 0;
    this.blueprintTypeName = v.blueprintTypeName ?? v.name ?? '-';
    this.blueprintTypeIconURL = v.blueprintTypeIconURL ?? '';
    this.runs = v.runs ?? 0;
    this.materialEfficiency = v.materialEfficiency ?? 0;
    this.timeEfficiency = v.timeEfficiency ?? 0;
    this.maxRuns = v.maxRuns ?? 0;
    this.spaceLocation = SpaceLocationNodeV1.fromDto(v.location);
  }

  static fromDto(dto: BlueprintV1DtoWire): BlueprintNodeV1 {
    return new BlueprintNodeV1(dto);
  }

  /** Stable identity for upsert merge (BLP-012). */
  getId(): number {
    return this.blueprintId;
  }

  getBlueprintId(): number {
    return this.blueprintId;
  }

  getName(): string {
    return this.blueprintTypeName;
  }

  getSpaceLocation(): SpaceLocationNodeV1 | undefined {
    return this.spaceLocation;
  }

  /** Adapt to BlueprintV1Node-compatible shape for existing blueprint render path. */
  toRenderRecord(): object {
    return {
      blueprintId: this.blueprintId,
      blueprintTypeId: this.blueprintTypeId,
      blueprintTypeName: this.blueprintTypeName,
      blueprintTypeIconURL: this.blueprintTypeIconURL,
      runs: this.runs,
      materialEfficiency: this.materialEfficiency,
      timeEfficiency: this.timeEfficiency,
      maxRuns: this.maxRuns,
    };
  }
}
