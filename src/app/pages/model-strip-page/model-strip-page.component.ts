import { Component } from '@angular/core';
import { NeoComVariant } from '../../modules/innovative-core/domain/NeoComVariant';
import { ApplicationInfoV1Node } from '../../modules/innovative-core/domain/nodes/application-info-v1.node';
import { BlueprintV1Node } from '../../modules/innovative-core/domain/nodes/blueprint-v1.node';
import { EveAssetV1Node } from '../../modules/innovative-core/domain/nodes/eve-asset-v1.node';
import { PublicCorporationV1Node } from '../../modules/innovative-core/domain/nodes/public-corporation-v1.node';
import { RegionV1Node } from '../../modules/innovative-core/domain/nodes/region-v1.node';
import { ServerStatusV1Node } from '../../modules/innovative-core/domain/nodes/server-status-v1.node';
import { SolarSystemV1Node } from '../../modules/innovative-core/domain/nodes/solar-system-v1.node';
import { V1FeatureButtonComponent } from '@renders/legacy-v1-feature-button/legacy-v1-feature-button.component';
import {
  FeatureSpecimen,
  LegacyV2FeatureRenderComponent,
} from '@renders/legacy-v2-feature-render/legacy-v2-feature-render.component';
import { V1ApplicationInfoRenderComponent } from '@renders/v1-application-info-render/v1-application-info-render.component';
import { V1AssetRenderComponent } from '@renders/v1-asset-render/v1-asset-render.component';
import { V1BlueprintRenderComponent } from '@renders/v1-blueprint-render/v1-blueprint-render.component';
import { V1CorporationRenderComponent } from '@renders/v1-corporation-render/v1-corporation-render.component';
import { V1RegionRenderComponent } from '@renders/v1-region-render/v1-region-render.component';
import { V1ServerStatusRenderComponent } from '@renders/v1-server-status-render/v1-server-status-render.component';
import { V1SystemRenderComponent } from '@renders/v1-system-render/v1-system-render.component';

/**
 * Visual catalog for EPIC-004 / EPIC-010 model appearances.
 * Route `/model-strip` — no auth. New specimens go at the top (IND-BP-004).
 * Validated ids: `docs/model-strip-validated.md` (IND-BP-002 / IND-BP-003).
 */
@Component({
  selector: 'model-strip-page',
  imports: [
    V1FeatureButtonComponent,
    LegacyV2FeatureRenderComponent,
    V1ApplicationInfoRenderComponent,
    V1AssetRenderComponent,
    V1BlueprintRenderComponent,
    V1CorporationRenderComponent,
    V1RegionRenderComponent,
    V1ServerStatusRenderComponent,
    V1SystemRenderComponent,
  ],
  templateUrl: './model-strip-page.component.html',
  styleUrl: './model-strip-page.component.scss',
  host: { class: 'neo-page' },
})
export class ModelStripPageComponent {
  protected readonly detailed = NeoComVariant.AVAILABLE_BLUEPRINTS;
  protected readonly regionLookupVariant = NeoComVariant.SOLAR_SYSTEM_LOOKUP;
  protected readonly corporationHeaderVariant = NeoComVariant.HEADER;

  /** Specimens listed as validated in `docs/model-strip-validated.md`. */
  protected readonly validated = new Set([
    'font-reference',
    'v1-system',
    'v1-region',
    'v1-blueprint',
    'v1-corporation-render',
    'v1-feature-button',
    'v1-application-info-render',
    'v1-server-status-render',
  ]);

  protected isValidated(id: string): boolean {
    return this.validated.has(id);
  }

  /**
   * EPIC-015 — base asset leaf (`v1-asset-render`).
   * Layout source: neocom-infinity `neocom-asset` / `asset.component.html`.
   */
  protected readonly assetSpecimen = new EveAssetV1Node({
    itemId: 1015046089001,
    typeId: 9832,
    quantity: 1250,
    locationId: 60003760,
    locationType: 'station',
    locationFlag: 'Hangar',
    isSingleton: false,
    name: 'Coolant',
    ownerPilotId: 93813310,
    item: {
      typeId: 9832,
      name: 'Coolant',
      categoryName: 'Planetary Commodities',
      groupName: 'Refined Commodities',
      volume: 0.38,
      sellPrice: 4125.5,
    },
  });

  /**
   * EPIC-006 — Corporation HEADER card (`v1-corporation-render`).
   * Enriched fixture: corp 98477920 + alliance Of Sound Mind + home location path.
   */
  protected readonly corporationSpecimen = new PublicCorporationV1Node({
    corporationId: 98477920,
    name: 'Nobody in Local',
    ticker: 'SA.FE',
    memberCount: 117,
    taxRate: 0.01,
    allianceId: 99000739,
    allianceName: 'Of Sound Mind',
    homeStationId: 60009940,
    homeLocationPath: 'LSC4-P I - Quafe Company Warehouse >> LSC4-P >> 49A-BZ >> Syndicate',
  });

  /** EPIC-010 — System second-level hierarchy card (`v1-system`); count = children. */
  protected readonly systemSpecimen = (() => {
    const system = new SolarSystemV1Node({ name: 'Amarr' });
    for (let i = 0; i < 5; i++) {
      system.addChild(new BlueprintV1Node({ blueprintId: i + 1, blueprintTypeName: `BP${i}` }));
    }
    return system;
  })();

  /** EPIC-010 — Region first-level hierarchy card (`v1-region`); count = children. */
  protected readonly regionSpecimen = (() => {
    const region = new RegionV1Node({ name: 'Domain' });
    for (let i = 0; i < 3; i++) {
      region.addChild(new SolarSystemV1Node({ name: `Sys${i}` }));
    }
    return region;
  })();

  /** Candidate A (discarded) — kept on strip for comparison only (IND-BP-011 / 012). */
  protected readonly featureStrip: FeatureSpecimen = {
    label: 'Industry',
    enabled: true,
    active: false,
    interaction: 'PAGEROUTE',
    route: '/industry/blueprints-by-location',
    imageRef: '/media/blueprints-feature.jpeg',
  };

  /** Selected Feature UI — `v1-feature-button` (IND-BP-012). */
  protected readonly featureButton: FeatureSpecimen = {
    label: 'Blueprint Availability',
    enabled: true,
    active: false,
    interaction: 'PAGEROUTE',
    route: '/industry/blueprints-by-location',
    imageRef: '/media/blueprints-feature.jpeg',
  };

  protected portrait = 'https://images.evetech.net/characters/93813310/portrait?size=64';

  protected readonly appInfo = new ApplicationInfoV1Node({
    name: 'NeoCom-Infinity',
    version: '0.20.0-435 dev',
    copyright: '© 2019,2024 Dimensinfin Industries',
  });

  protected readonly serverStatus = new ServerStatusV1Node({
    server: 'tranquility',
    players: 26172,
    backendVersion: '0.20.0',
    SDEVersion: '20201231-APP',
    nextDowntime: 'Downtime in 19 hours',
  });

  /** Base identity card specimen (DOM-BP-003 / media/v1-blueprint.png). */
  protected readonly blueprintV1 = new BlueprintV1Node({
    blueprintId: 1015046088217,
    blueprintTypeId: 31717,
    blueprintTypeName: 'Small EM Shield Reinforcer I Blueprint',
    outputTypeId: 31716,
    outputTypeName: 'Small EM Shield Reinforcer I',
    runs: 300,
    materialEfficiency: 10,
    timeEfficiency: 20,
    maxRuns: 300,
  });

  protected readonly blueprint = new BlueprintV1Node({
    blueprintId: 31717,
    blueprintTypeName: 'Small EM Shield Reinforcer I Blueprint',
    manufactureIndex: 199,
    ready: true,
  });

  protected useDefaultPortrait(): void {
    this.portrait = 'https://images.evetech.net/characters/1/portrait?size=64';
  }
}
