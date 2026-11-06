import { Component, Input } from '@angular/core';
import { RegionV1Node } from '@domain';
import { NeoComVariant } from '../../../innovative-core/domain/NeoComVariant';
import { V1RegionRenderComponent } from '@renders/v1-region-render/v1-region-render.component';

/**
 * First hierarchy level for blueprint-by-location: distinct Regions where blueprints sit.
 */
@Component({
  selector: 'blueprint-regions-panel',
  imports: [V1RegionRenderComponent],
  templateUrl: './blueprint-regions-panel.component.html',
  styleUrl: './blueprint-regions-panel.component.scss',
})
export class BlueprintRegionsPanelComponent {
  @Input() regions: RegionV1Node[] = [];

  protected readonly lookupVariant = NeoComVariant.SOLAR_SYSTEM_LOOKUP;
}
