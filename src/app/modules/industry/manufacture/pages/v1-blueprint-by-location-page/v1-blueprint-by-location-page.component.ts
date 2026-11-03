import { Component } from '@angular/core';
import { HeaderModule } from '../../../../header/header.module';
import { RegionLookupNode } from '../../../../innovative-core/domain/nodes/region-lookup.node';
import { BlueprintRegionsPanelComponent } from '../../panels/blueprint-regions-panel/blueprint-regions-panel.component';

/**
 * Short name: **v1-blueprint-by-location**.
 * Pilot blueprints classified by location — first hierarchy level is Region.
 * Reachable without authentication for strip / UI development (`/industry/manufacture/blueprints`).
 */
@Component({
  selector: 'v1-blueprint-by-location-page',
  imports: [HeaderModule, BlueprintRegionsPanelComponent],
  templateUrl: './v1-blueprint-by-location-page.component.html',
  styleUrl: './v1-blueprint-by-location-page.component.scss',
  host: { class: 'neo-page' },
})
export class V1BlueprintByLocationPageComponent {
  /**
   * Fixture distinct Regions (no auth / no back call yet).
   * Replace with pilot blueprint location aggregation when wired.
   */
  protected readonly regions: RegionLookupNode[] = [
    new RegionLookupNode({ name: 'Domain', systemsCount: 3 }),
    new RegionLookupNode({ name: 'The Forge', systemsCount: 12 }),
    new RegionLookupNode({ name: 'Metropolis', systemsCount: 5 }),
  ];
}
