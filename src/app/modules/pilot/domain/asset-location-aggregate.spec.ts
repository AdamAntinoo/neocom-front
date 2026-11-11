import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { EveAssetV1Node } from '../../innovative-core/domain/nodes/eve-asset-v1.node';
import { RegionV1Node } from '../../innovative-core/domain/nodes/region-v1.node';
import { SolarSystemV1Node } from '../../innovative-core/domain/nodes/solar-system-v1.node';
import { SpaceLocationNodeV1 } from '../../innovative-core/domain/nodes/space-location-v1.node';
import type { SpaceLocationService } from '../../services/space-location.service';
import { AssetLocationAggregate } from './asset-location-aggregate';

describe('AssetLocationAggregate', () => {
  function asset(locationId: number, name: string): EveAssetV1Node {
    return new EveAssetV1Node({
      itemId: locationId,
      typeId: 1,
      quantity: 1,
      locationId,
      name,
      item: { name, typeId: 1 },
    });
  }

  it('builds Region → System → Asset when the place has an aggregation chain', async () => {
    const locations = {
      resolve: (id: number) =>
        of(
          new SpaceLocationNodeV1({
            locationId: id,
            regionId: 10000043,
            regionName: 'Domain',
            solarSystemId: 30002187,
            solarSystemName: 'Amarr',
          }),
        ),
    } as Pick<SpaceLocationService, 'resolve'>;

    const agg = new AssetLocationAggregate();
    const roots = await agg.rebuild(
      [asset(60008494, 'Alpha'), asset(60008494, 'Beta')],
      locations as SpaceLocationService,
    );

    expect(roots).toHaveLength(1);
    expect(roots[0]).toBeInstanceOf(RegionV1Node);
    expect((roots[0] as RegionV1Node).getName()).toBe('Domain');
    expect(roots[0].getChildren()).toHaveLength(1);
    expect(roots[0].getChildren()[0]).toBeInstanceOf(SolarSystemV1Node);
    expect((roots[0].getChildren()[0] as SolarSystemV1Node).getName()).toBe('Amarr');
    expect(roots[0].getChildren()[0].getChildren()).toHaveLength(2);
  });

  it('places assets under UnidentifiedLocation when resolve fails or has no chain', async () => {
    const locations = {
      resolve: (id: number) =>
        id === 1
          ? throwError(() => new Error('missing'))
          : of(new SpaceLocationNodeV1({ locationId: id })),
    } as Pick<SpaceLocationService, 'resolve'>;

    const agg = new AssetLocationAggregate();
    const roots = await agg.rebuild(
      [asset(1, 'Lost'), asset(2, 'Bare')],
      locations as SpaceLocationService,
    );

    expect(roots).toHaveLength(2);
    expect(roots.map((r) => r.getJsonClass())).toEqual([
      'UnidentifiedLocationV1',
      'UnidentifiedLocationV1',
    ]);
  });

  it('does not call resolve for non-positive locationId but still places the asset', async () => {
    const resolve = vi.fn(() => of(null));
    const locations = { resolve } as Pick<SpaceLocationService, 'resolve'>;

    const agg = new AssetLocationAggregate();
    const roots = await agg.rebuild([asset(0, 'Nowhere')], locations as SpaceLocationService);
    expect(resolve).not.toHaveBeenCalled();
    expect(roots).toHaveLength(1);
    expect(roots[0].getJsonClass()).toBe('UnidentifiedLocationV1');
  });
});
