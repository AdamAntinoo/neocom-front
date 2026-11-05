import { NeoCom } from '../NeoCom';

/** Wire shape for embedded `SpaceLocationV1Dto` (BLP-016). */
export type SpaceLocationV1DtoWire = {
  jsonClass?: string;
  locationType?: string;
  locationId?: number;
  regionId?: number;
  regionName?: string;
  constellationId?: number;
  constellationName?: string;
  solarSystemId?: number;
  solarSystemName?: string;
  stationId?: number;
  stationName?: string;
  structureId?: number;
  structureName?: string;
};

/**
 * Front NeoCom for catalog space location (BLP-016 / BLP-017).
 * Tied to {@link BlueprintNodeV1} so aggregation can read region/system ids.
 */
export class SpaceLocationNodeV1 extends NeoCom {
  locationId: number;
  locationType: string;
  regionId?: number;
  regionName?: string;
  solarSystemId?: number;
  solarSystemName?: string;
  stationId?: number;
  stationName?: string;

  constructor(values: SpaceLocationV1DtoWire | object = {}) {
    super();
    this.jsonClass = 'SpaceLocationNodeV1';
    const v = values as SpaceLocationV1DtoWire;
    this.locationId = v.locationId ?? 0;
    this.locationType = v.locationType ?? '';
    this.regionId = v.regionId;
    this.regionName = v.regionName;
    this.solarSystemId = v.solarSystemId;
    this.solarSystemName = v.solarSystemName;
    this.stationId = v.stationId;
    this.stationName = v.stationName;
  }

  static fromDto(dto: SpaceLocationV1DtoWire | null | undefined): SpaceLocationNodeV1 | undefined {
    if (!dto) {
      return undefined;
    }
    return new SpaceLocationNodeV1(dto);
  }

  getRegionId(): number | undefined {
    return this.regionId;
  }

  getRegionName(): string {
    return (this.regionName ?? '').trim();
  }

  getSolarSystemId(): number | undefined {
    return this.solarSystemId;
  }

  getSolarSystemName(): string {
    return (this.solarSystemName ?? '').trim();
  }

  /** True when region + system names are present for IND-BP aggregation. */
  hasAggregationChain(): boolean {
    return this.getRegionName().length > 0 && this.getSolarSystemName().length > 0;
  }
}
