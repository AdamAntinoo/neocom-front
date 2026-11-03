import { BlueprintV1Node } from '../../innovative-core/domain/nodes/blueprint-v1.node';
import { BlueprintLocationAggregate } from './blueprint-location-aggregate';

describe('BlueprintLocationAggregate', () => {
  it('builds Region → System → Blueprint from location chains', () => {
    const agg = new BlueprintLocationAggregate();
    const a = new BlueprintV1Node({ blueprintId: 1, blueprintTypeName: 'A' });
    const b = new BlueprintV1Node({ blueprintId: 2, blueprintTypeName: 'B' });
    const c = new BlueprintV1Node({ blueprintId: 3, blueprintTypeName: 'C' });

    const roots = agg.rebuildFrom([
      {
        node: a,
        location: { regionName: 'Domain', solarSystemName: 'Amarr' },
      },
      {
        node: b,
        location: { regionName: 'Domain', solarSystemName: 'Amarr' },
      },
      {
        node: c,
        location: { regionName: 'The Forge', solarSystemName: 'Jita' },
      },
    ]);

    expect(roots).toHaveLength(2);
    expect(roots[0].getName()).toBe('Domain');
    expect(roots[0].getSystemsCount()).toBe(1);
    expect(roots[0].getChildren()[0].getChildren()).toHaveLength(2);
    expect(roots[1].getName()).toBe('The Forge');
  });

  it('skips blueprints without a location chain', () => {
    const agg = new BlueprintLocationAggregate();
    const roots = agg.rebuildFrom([
      { node: new BlueprintV1Node({ blueprintId: 9, blueprintTypeName: 'X' }) },
    ]);
    expect(roots).toHaveLength(0);
  });
});
