import { BlueprintV1Node } from '../../innovative-core/domain/nodes/blueprint-v1.node';
import { RegionLookupNode } from '../../innovative-core/domain/nodes/region-lookup.node';
import { SystemLookupNode } from '../../innovative-core/domain/nodes/system-lookup.node';

/** Location chain fields when NeoCom back / SSE supply them (IND-BP-117). */
export type BlueprintLocationChain = {
  regionId?: number;
  regionName?: string;
  solarSystemId?: number;
  solarSystemName?: string;
};

type RegionBucket = {
  region: RegionLookupNode;
  systems: Map<string, SystemLookupNode>;
};

/**
 * Aggregate pilot blueprints into Region → System → Blueprint roots (IND-BP-112…115).
 * Blueprints without a resolvable location chain are skipped (no invented regions/systems).
 */
export class BlueprintLocationAggregate {
  private readonly buckets = new Map<string, RegionBucket>();

  clear(): void {
    this.buckets.clear();
  }

  /** Replace tree from a full list snapshot. */
  rebuildFrom(
    blueprints: Array<{ node: BlueprintV1Node; location?: BlueprintLocationChain }>,
  ): RegionLookupNode[] {
    this.clear();
    for (const entry of blueprints) {
      this.upsert(entry.node, entry.location);
    }
    return this.roots();
  }

  upsert(node: BlueprintV1Node, location?: BlueprintLocationChain): void {
    const chain = normalizeChain(location);
    if (!chain) {
      return;
    }

    let bucket = this.buckets.get(chain.regionKey);
    if (!bucket) {
      bucket = {
        region: new RegionLookupNode({ name: chain.regionName, systemsCount: 0 }),
        systems: new Map(),
      };
      this.buckets.set(chain.regionKey, bucket);
    }

    let system = bucket.systems.get(chain.systemKey);
    if (!system) {
      system = new SystemLookupNode({ name: chain.solarSystemName, blueprintsCount: 0 });
      bucket.systems.set(chain.systemKey, system);
      bucket.region.addChild(system);
    }

    const children = system.getChildren();
    const idx = children.findIndex(
      (child) => child instanceof BlueprintV1Node && child.getBlueprintId() === node.getBlueprintId(),
    );
    if (idx >= 0) {
      children[idx] = node;
    } else {
      system.addChild(node);
    }
  }

  roots(): RegionLookupNode[] {
    return [...this.buckets.values()]
      .map((b) => b.region)
      .sort((a, b) => a.getName().localeCompare(b.getName()));
  }
}

function normalizeChain(location?: BlueprintLocationChain): {
  regionKey: string;
  regionName: string;
  systemKey: string;
  solarSystemName: string;
} | null {
  if (!location) {
    return null;
  }
  const regionName = (location.regionName ?? '').trim();
  const solarSystemName = (location.solarSystemName ?? '').trim();
  if (!regionName || !solarSystemName) {
    return null;
  }
  const regionKey =
    location.regionId != null && location.regionId > 0
      ? `r:${location.regionId}`
      : `rn:${regionName.toLowerCase()}`;
  const systemKey =
    location.solarSystemId != null && location.solarSystemId > 0
      ? `s:${location.solarSystemId}`
      : `sn:${solarSystemName.toLowerCase()}`;
  return { regionKey, regionName, systemKey, solarSystemName };
}
