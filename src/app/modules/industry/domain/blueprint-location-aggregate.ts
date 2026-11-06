import {
  BlueprintV1Node,
  RegionV1Node,
  SolarSystemV1Node,
  type SpaceLocationNodeV1,
} from '@domain';

/** Location chain fields when NeoCom back supplies them (IND-BP-117). */
export type BlueprintLocationChain = {
  regionId?: number;
  regionName?: string;
  solarSystemId?: number;
  solarSystemName?: string;
};

type RegionBucket = {
  region: RegionV1Node;
  systems: Map<string, SolarSystemV1Node>;
};

/**
 * Aggregate pilot blueprints into Region → System → Blueprint via NeoCom children
 * (DEF-BLP-007 / 012). No Lookup* or Listing subclass.
 */
export class BlueprintLocationAggregate {
  private readonly buckets = new Map<string, RegionBucket>();

  clear(): void {
    this.buckets.clear();
  }

  /** Replace tree from provider NeoCom blueprints. */
  rebuildFromNodes(blueprints: BlueprintV1Node[]): RegionV1Node[] {
    this.clear();
    for (const bp of blueprints) {
      this.upsertNode(bp);
    }
    return this.roots();
  }

  upsertNode(node: BlueprintV1Node): void {
    const chain = chainFromSpace(node.getSpaceLocation()) ?? null;
    if (!chain) {
      return;
    }
    this.placeLeaf(node, chain);
  }

  roots(): RegionV1Node[] {
    return [...this.buckets.values()]
      .map((b) => b.region)
      .sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  private placeLeaf(
    node: BlueprintV1Node,
    chain: {
      regionKey: string;
      regionName: string;
      regionId?: number;
      systemKey: string;
      solarSystemName: string;
      solarSystemId?: number;
    },
  ): void {
    let bucket = this.buckets.get(chain.regionKey);
    if (!bucket) {
      bucket = {
        region: new RegionV1Node({ name: chain.regionName, regionId: chain.regionId }),
        systems: new Map(),
      };
      this.buckets.set(chain.regionKey, bucket);
    }

    let system = bucket.systems.get(chain.systemKey);
    if (!system) {
      system = new SolarSystemV1Node({
        name: chain.solarSystemName,
        solarSystemId: chain.solarSystemId,
      });
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
}

function chainFromSpace(location?: SpaceLocationNodeV1): ReturnType<typeof normalizeChain> {
  if (!location || !location.hasAggregationChain()) {
    return null;
  }
  return normalizeChain({
    regionId: location.getRegionId(),
    regionName: location.getRegionName(),
    solarSystemId: location.getSolarSystemId(),
    solarSystemName: location.getSolarSystemName(),
  });
}

function normalizeChain(location?: BlueprintLocationChain): {
  regionKey: string;
  regionName: string;
  regionId?: number;
  systemKey: string;
  solarSystemName: string;
  solarSystemId?: number;
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
  return {
    regionKey,
    regionName,
    regionId: location.regionId,
    systemKey,
    solarSystemName,
    solarSystemId: location.solarSystemId,
  };
}
