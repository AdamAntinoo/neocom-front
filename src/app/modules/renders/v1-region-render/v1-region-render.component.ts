import { Component, Input, OnInit } from '@angular/core';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { RegionLookupNode } from '../../innovative-core/domain/nodes/region-lookup.node';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

/**
 * Region lookup card — infinity `v1-region-render`.
 * Variant `-SOLAR-SYSTEM-LOOKUP-` (yellow panel).
 */
@Component({
  selector: 'v1-region-render',
  templateUrl: './v1-region-render.component.html',
  styleUrl: './v1-region-render.component.scss',
})
export class V1RegionRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: RegionLookupNode;
  @Input() variant: NeoComVariant | string = NeoComVariant.SOLAR_SYSTEM_LOOKUP;

  private static registered = false;

  static ensureRegistered(): void {
    if (V1RegionRenderComponent.registered) {
      return;
    }
    registerRender('LookupRegion', V1RegionRenderComponent);
    V1RegionRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1RegionRenderComponent.ensureRegistered();
  }

  getVariant(): string {
    return String(this.variant);
  }

  getName(): string {
    return this.node?.getName() ?? '-';
  }

  getSystemsCount(): number {
    return this.node?.getSystemsCount() ?? 0;
  }
}
