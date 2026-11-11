import { BlueprintV1Node, SpaceLocationNodeV1, type BlueprintV1DtoWire } from '@domain';
import type { BlueprintLocationChain } from './blueprint-location-aggregate';

/**
 * @deprecated Prefer {@link BlueprintV1Node}. Thin alias for manufacture-list migration (DEF-BLP-010).
 * jsonClass stays `BlueprintV1` so render registration matches the canonical node.
 */
export class ProcessedBlueprint extends BlueprintV1Node {
  /** Optional legacy location chain field (IND-BP-117). Prefer spaceLocation on BlueprintV1Node. */
  // public location?: BlueprintLocationChain;

  constructor(values: (BlueprintV1DtoWire & { location?: BlueprintLocationChain }) | object = {}) {
    const v = values as BlueprintV1DtoWire & { name?: string; location?: BlueprintLocationChain };
    super({
      ...v,
      blueprintTypeName: v.blueprintTypeName ?? v.name,
    });
    this.jsonClass = 'BlueprintV1';
  }

  /** Legacy accessor name used by manufacture-list adapters. */
  getLocation(): SpaceLocationNodeV1 | undefined {
    return this.getSpaceLocation();
  }
}

/** @deprecated Same render as {@link BlueprintV1Node}. */
export class ProcessedBlueprintSummary extends ProcessedBlueprint {}
