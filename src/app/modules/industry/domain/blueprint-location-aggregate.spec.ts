import { BlueprintV1Node } from '@domain';
import { BlueprintLocationAggregate } from './blueprint-location-aggregate';

describe('BlueprintLocationAggregate', () => {
  it('builds Region → System → Blueprint from provider NeoCom nodes', () => {
    const agg = new BlueprintLocationAggregate();
    const roots = agg.rebuildFromNodes([
      new BlueprintV1Node({
        blueprintId: 1,
        blueprintTypeName: 'A',
        location: { regionName: 'Domain', solarSystemName: 'Amarr' },
      }),
      new BlueprintV1Node({
        blueprintId: 2,
        blueprintTypeName: 'B',
        location: { regionName: 'Domain', solarSystemName: 'Amarr' },
      }),
      new BlueprintV1Node({
        blueprintId: 3,
        blueprintTypeName: 'C',
        location: { regionName: 'The Forge', solarSystemName: 'Jita' },
      }),
    ]);

    expect(roots).toHaveLength(2);
    expect(roots[0].getName()).toBe('Domain');
    expect(roots[0].getSystemsCount()).toBe(1);
    expect(roots[0].getChildren()[0].getChildren()).toHaveLength(2);
    expect(roots[1].getName()).toBe('The Forge');
  });

  it('skips blueprints without a location chain', () => {
    const agg = new BlueprintLocationAggregate();
    const roots = agg.rebuildFromNodes([
      new BlueprintV1Node({ blueprintId: 9, blueprintTypeName: 'X' }),
    ]);
    expect(roots).toHaveLength(0);
  });
});
