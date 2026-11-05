import { BlueprintNodeV1 } from '../../innovative-core/domain/nodes/blueprint-node-v1';
import { BlueprintV1Node } from '../../innovative-core/domain/nodes/blueprint-v1.node';
import { RegionLookupNode } from '../../innovative-core/domain/nodes/region-lookup.node';
import { SystemLookupNode } from '../../innovative-core/domain/nodes/system-lookup.node';
import type { SpaceLocationNodeV1 } from '../../innovative-core/domain/nodes/space-location-v1.node';

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
 * Aggregate pilot blueprints into Region → System → Blueprint roots (IND-BP-112…115 / BLP-004…006).
 * Blueprints without a resolvable location chain are skipped (no invented regions/systems).
 * Region / System remain NeoCom subclasses ({@link RegionLookupNode}, {@link SystemLookupNode}).
 */
export class BlueprintLocationAggregate {
  private readonly buckets = new Map<string, RegionBucket>();

  clear(): void {
    this.buckets.clear();
  }

  /** Replace tree from provider NeoCom blueprints (BLP-004…006). */
  rebuildFromNodes(blueprints: BlueprintNodeV1[]): RegionLookupNode[] {
    this.clear();
    for (const bp of blueprints) {
      this.upsertNode(bp);
    }
    return this.roots();
  }

  /** @deprecated Prefer {@link rebuildFromNodes}; kept for existing unit tests. */
  rebuildFrom(
    blueprints: Array<{ node: BlueprintV1Node; location?: BlueprintLocationChain }>,
  ): RegionLookupNode[] {
    this.clear();
    for (const entry of blueprints) {
      this.upsert(entry.node, entry.location);
    }
    return this.roots();
  }

  upsertNode(node: BlueprintNodeV1): void {
    const chain = chainFromSpace(node.getSpaceLocation()) ?? null;
    if (!chain) {
      return;
    }
    this.placeLeaf(toBlueprintV1Node(node), chain);
  }

  upsert(node: BlueprintV1Node, location?: BlueprintLocationChain): void {
    const chain = normalizeChain(location);
    if (!chain) {
      return;
    }
    this.placeLeaf(node, chain);
  }

  roots(): RegionLookupNode[] {
    return [...this.buckets.values()]
      .map((b) => b.region)
      .sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  private placeLeaf(
    node: BlueprintV1Node,
    chain: {
      regionKey: string;
      regionName: string;
      systemKey: string;
      solarSystemName: string;
    },
  ): void {
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

function toBlueprintV1Node(node: BlueprintNodeV1): BlueprintV1Node {
  return new BlueprintV1Node(node.toRenderRecord());
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
