import { ApplicationInfoV1, ServerStatusV1 } from 'neocom-domain';
import { ApplicationInfoV1Node } from './application-info-v1.node';
import { BlueprintV1Node } from './blueprint-v1.node';
import { EveAssetV1Node } from './eve-asset-v1.node';
import { FeatureV1Node } from './feature-v1.node';
import { LocatedAssetContainerV1Node } from './located-asset-container-v1.node';
import { PublicCorporationV1Node } from './public-corporation-v1.node';
import { RegionV1Node } from './region-v1.node';
import { ServerStatusV1Node } from './server-status-v1.node';
import { SolarSystemV1Node } from './solar-system-v1.node';
import { SpaceLocationNodeV1 } from './space-location-v1.node';
import { UnidentifiedLocationV1Node } from './unidentified-location-v1.node';

describe('domain NeoCom nodes (CICD-F-050…053)', () => {
  it('ApplicationInfoV1Node maps construction, jsonClass, and accessors', () => {
    const node = ApplicationInfoV1Node.from(
      new ApplicationInfoV1({ name: 'neocom-front', version: '0.1.0', copyright: '© test' }),
    );
    expect(node.getJsonClass()).toBe('ApplicationInfoV1');
    expect(node.getName()).toBe('neocom-front');
    expect(node.getVersion()).toBe('0.1.0');
    expect(node.getCopyright()).toBe('© test');
    expect(node.getRecord()).toBeInstanceOf(ApplicationInfoV1);
  });

  it('ServerStatusV1Node maps construction, jsonClass, and accessors', () => {
    const node = ServerStatusV1Node.from(
      new ServerStatusV1({
        server: 'Tranquility',
        players: 12,
        start_time: '2026-01-01T00:00:00Z',
      }),
    );
    expect(node.getJsonClass()).toBe('ServerStatusV1');
    expect(node.getServerName()).toBe('Tranquility');
    expect(node.getPlayersCount()).toBe(12);
    expect(node.getRecord()).toBeInstanceOf(ServerStatusV1);
  });

  it('PublicCorporationV1Node maps tax percent and alliance flags', () => {
    const node = PublicCorporationV1Node.from({
      corporationId: 1000077,
      name: 'Corp',
      ticker: 'CRP',
      taxRate: 0.05,
      allianceId: 99,
      allianceName: 'Ally',
      homeStationId: 1,
      homeLocationPath: 'Home >> System >> Constellation >> Region',
    });
    expect(node.getJsonClass()).toBe('PublicCorporationV1');
    expect(node.getTaxRatePercent()).toBe('5%');
    expect(node.hasAlliance()).toBe(true);
    expect(node.hasHomeLocation()).toBe(true);
    expect(node.getCorporationIcon()).toContain('1000077');
  });

  it('FeatureV1Node maps wire and child features', () => {
    const node = FeatureV1Node.from({
      featureId: 'industry',
      label: 'Industry',
      route: '/app/industry',
      children: [{ featureId: 'bp', label: 'Blueprints' }],
    });
    expect(node.getJsonClass()).toBe('FeatureV1');
    expect(node.getFeatureId()).toBe('industry');
    expect(node.isEnabled()).toBe(true);
    expect(node.getImageRef()).toContain('blueprints-feature');
    expect(node.getChildFeatures()).toHaveLength(1);
    expect(node.getChildFeatures()[0].getLabel()).toBe('Blueprints');
  });

  it('SpaceLocationNodeV1 maps aggregation chain', () => {
    const node = SpaceLocationNodeV1.fromDto({
      locationId: 60003760,
      locationType: 'station',
      regionId: 10000002,
      regionName: 'The Forge',
      solarSystemId: 30000142,
      solarSystemName: 'Jita',
    });
    expect(node?.getJsonClass()).toBe('SpaceLocationNodeV1');
    expect(node?.hasAggregationChain()).toBe(true);
    expect(SpaceLocationNodeV1.fromDto(undefined)).toBeUndefined();
  });

  it('BlueprintV1Node maps dto wire and nested location', () => {
    const node = BlueprintV1Node.fromDto({
      blueprintId: 10,
      blueprintTypeName: 'Venture Blueprint',
      runs: 2,
      materialEfficiency: 10,
      timeEfficiency: 20,
      location: { locationId: 1, regionName: 'The Forge', solarSystemName: 'Jita' },
    });
    expect(node.getJsonClass()).toBe('BlueprintV1');
    expect(node.getName()).toBe('Venture Blueprint');
    expect(node.getRuns()).toBe(2);
    expect(node.getSpaceLocation()?.getRegionName()).toBe('The Forge');
  });

  it('RegionV1Node and SolarSystemV1Node count children', () => {
    const region = new RegionV1Node({ name: 'The Forge', regionId: 10000002 });
    const system = new SolarSystemV1Node({ name: 'Jita', solarSystemId: 30000142 });
    region.addChild(system);
    system.addChild(BlueprintV1Node.fromDto({ blueprintId: 1, blueprintTypeName: 'BP' }));
    expect(region.getJsonClass()).toBe('RegionV1');
    expect(region.getSystemsCount()).toBe(1);
    expect(system.getJsonClass()).toBe('SolarSystemV1');
    expect(system.getBlueprintsCount()).toBe(1);
  });

  it('EveAssetV1Node maps priced item totals', () => {
    const node = EveAssetV1Node.fromDto({
      itemId: 7,
      quantity: 3,
      item: { name: 'Tritanium', sellPrice: 5.5, volume: 0.01, categoryName: 'Material' },
    });
    expect(node.getJsonClass()).toBe('EveAssetV1');
    expect(node.getName()).toBe('Tritanium');
    expect(node.getItemValue()).toBe(5.5);
    expect(node.getTotalValue()).toBe(16.5);
    expect(node.getTotalVolume()).toBeCloseTo(0.03);
    expect(node.isExpandable()).toBe(false);
  });

  it('LocatedAssetContainerV1Node expands when contents attached', () => {
    const container = LocatedAssetContainerV1Node.fromContainerDto({
      itemId: 1,
      name: 'Hangar',
      quantity: 1,
    });
    expect(container.getJsonClass()).toBe('LocatedAssetContainerV1');
    expect(container.isExpandable()).toBe(false);
    container.setContents([EveAssetV1Node.fromDto({ itemId: 2, quantity: 1, name: 'Ore' })]);
    expect(container.isExpandable()).toBe(true);
    expect(container.getChildren()).toHaveLength(1);
  });

  it('UnidentifiedLocationV1Node names location and counts assets', () => {
    const node = new UnidentifiedLocationV1Node({ locationId: 42 });
    expect(node.getJsonClass()).toBe('UnidentifiedLocationV1');
    expect(node.getName()).toBe('Location 42');
    expect(node.getAssetCount()).toBe(0);
    node.addChild(EveAssetV1Node.fromDto({ itemId: 1, quantity: 1 }));
    expect(node.getAssetCount()).toBe(1);
    expect(node.isExpandable()).toBe(true);
  });
});
