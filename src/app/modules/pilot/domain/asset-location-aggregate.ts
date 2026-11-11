import { firstValueFrom } from 'rxjs';
import { RegionV1Node } from '../../innovative-core/domain/nodes/region-v1.node';
import { SolarSystemV1Node } from '../../innovative-core/domain/nodes/solar-system-v1.node';
import type { SpaceLocationNodeV1 } from '../../innovative-core/domain/nodes/space-location-v1.node';
import { UnidentifiedLocationV1Node } from '../../innovative-core/domain/nodes/unidentified-location-v1.node';
import type { NeoCom } from '../../innovative-core/domain/NeoCom';
import type { PilotAssetNode } from '../../services/pilot-asset-provider.service';
import type { SpaceLocationService } from '../../services/space-location.service';

type RegionBucket = {
  region: RegionV1Node;
  systems: Map<string, SolarSystemV1Node>;
};

/**
 * Aggregate pilot assets by `locationId` via spacelocations service (FAL-021…035).
 * Roots: Region… and UnidentifiedLocation… Place children: Asset / AssetContainer.
 */
export class AssetLocationAggregate {
  private readonly regions = new Map<string, RegionBucket>();
  private readonly unidentified = new Map<number, UnidentifiedLocationV1Node>();

  clear(): void {
    this.regions.clear();
    this.unidentified.clear();
  }

  /**
   * Resolve places for unique locationIds, then build hierarchy roots.
   * Nullifies nested location use by never reading asset.location — only locationId.
   */
  async rebuild(assets: PilotAssetNode[], locations: SpaceLocationService): Promise<NeoCom[]> {
    this.clear();
    const ids = new Set<number>();
    for (const asset of assets) {
      if (asset.locationId > 0) {
        ids.add(asset.locationId);
      }
    }
    const resolved = new Map<number, SpaceLocationNodeV1 | null>();
    await Promise.all(
      [...ids].map(async (id) => {
        try {
          const place = await firstValueFrom(locations.resolve(id));
          resolved.set(id, place);
        } catch {
          resolved.set(id, null);
        }
      }),
    );

    for (const asset of assets) {
      this.placeAsset(asset, resolved.get(asset.locationId) ?? null);
    }
    return this.roots();
  }

  roots(): NeoCom[] {
    const regionRoots = [...this.regions.values()]
      .map((b) => b.region)
      .sort((a, b) => a.getName().localeCompare(b.getName()));
    const unidentifiedRoots = [...this.unidentified.values()].sort(
      (a, b) => a.getLocationId() - b.getLocationId(),
    );
    return [...regionRoots, ...unidentifiedRoots];
  }

  private placeAsset(asset: PilotAssetNode, place: SpaceLocationNodeV1 | null): void {
    if (place?.hasAggregationChain()) {
      this.placeUnderRegionSystem(asset, place);
      return;
    }
    this.placeUnderUnidentified(asset);
  }

  private placeUnderRegionSystem(asset: PilotAssetNode, place: SpaceLocationNodeV1): void {
    const regionName = place.getRegionName();
    const systemName = place.getSolarSystemName();
    const regionKey = String(place.getRegionId() ?? regionName);
    const systemKey = String(place.getSolarSystemId() ?? systemName);

    let bucket = this.regions.get(regionKey);
    if (!bucket) {
      bucket = {
        region: new RegionV1Node({
          name: regionName,
          regionId: place.getRegionId(),
        }),
        systems: new Map(),
      };
      this.regions.set(regionKey, bucket);
    }

    let system = bucket.systems.get(systemKey);
    if (!system) {
      system = new SolarSystemV1Node({
        name: systemName,
        solarSystemId: place.getSolarSystemId(),
      });
      bucket.systems.set(systemKey, system);
      bucket.region.addChild(system);
    }
    system.addChild(asset);
  }

  private placeUnderUnidentified(asset: PilotAssetNode): void {
    const id = asset.locationId;
    let root = this.unidentified.get(id);
    if (!root) {
      root = new UnidentifiedLocationV1Node({ locationId: id });
      this.unidentified.set(id, root);
    }
    root.addChild(asset);
  }
}
