import { NeoCom } from '../NeoCom';
import { SpaceLocationNodeV1, type SpaceLocationV1DtoWire } from './space-location-v1.node';

/** Wire shape for endpoint / cache DTO (DEF-BLP-013). Not npm `BlueprintV1`. */
export type BlueprintV1DtoWire = {
  jsonClass?: string;
  id?: number;
  blueprintId?: number;
  blueprintTypeId?: number;
  blueprintTypeName?: string;
  blueprintTypeIconURL?: string;
  outputTypeId?: number;
  outputTypeName?: string;
  outputTypeIconURL?: string;
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
 * Canonical front NeoCom for Blueprint (DEF-BLP-009 / 010 / 013).
 * File: `blueprint-v1.node.ts`. jsonClass `BlueprintV1` (= render registration).
 */
export class BlueprintV1Node extends NeoCom {
  blueprintId: number;
  blueprintTypeId: number;
  blueprintTypeName: string;
  blueprintTypeIconURL: string;
  outputTypeId: number;
  outputTypeName: string;
  outputTypeIconURL: string;
  runs: number;
  materialEfficiency: number;
  timeEfficiency: number;
  maxRuns: number;
  ready: boolean;
  manufactureIndex: number | null;
  spaceLocation?: SpaceLocationNodeV1;

  constructor(values: BlueprintV1DtoWire | object = {}) {
    super();
    this.jsonClass = 'BlueprintV1';
    const v = values as BlueprintV1DtoWire;
    this.blueprintId = v.blueprintId ?? v.id ?? 0;
    this.blueprintTypeId = v.blueprintTypeId ?? 0;
    this.blueprintTypeName = v.blueprintTypeName ?? v.name ?? '-';
    this.blueprintTypeIconURL = v.blueprintTypeIconURL ?? '';
    this.outputTypeId = v.outputTypeId ?? 0;
    this.outputTypeName = v.outputTypeName ?? '';
    this.outputTypeIconURL = v.outputTypeIconURL ?? '';
    this.runs = v.runs ?? 0;
    this.materialEfficiency = v.materialEfficiency ?? 0;
    this.timeEfficiency = v.timeEfficiency ?? 0;
    this.maxRuns = v.maxRuns ?? 0;
    this.ready = v.ready ?? false;
    this.manufactureIndex = v.manufactureIndex ?? null;
    this.spaceLocation = SpaceLocationNodeV1.fromDto(v.location);
  }

  static fromDto(dto: BlueprintV1DtoWire): BlueprintV1Node {
    return new BlueprintV1Node(dto);
  }

  getId(): number {
    return this.blueprintId;
  }

  getBlueprintId(): number {
    return this.blueprintId;
  }

  getName(): string {
    return this.blueprintTypeName;
  }

  getBlueprintTypeName(): string {
    return this.blueprintTypeName;
  }

  getBlueprintTypeIconURL(): string {
    return this.blueprintTypeIconURL;
  }

  getOutputTypeId(): number {
    return this.outputTypeId;
  }

  getOutputTypeName(): string {
    return this.outputTypeName;
  }

  getOutputTypeIconURL(): string {
    return this.outputTypeIconURL;
  }

  getRuns(): number {
    return this.runs;
  }

  getMaxRuns(): number {
    return this.maxRuns;
  }

  getMaterialEfficiency(): number {
    return this.materialEfficiency;
  }

  getTimeEfficiency(): number {
    return this.timeEfficiency;
  }

  getSpaceLocation(): SpaceLocationNodeV1 | undefined {
    return this.spaceLocation;
  }

  getManufactureIndex(): number | null {
    return this.manufactureIndex;
  }

  isReady(): boolean {
    return this.ready;
  }
}
