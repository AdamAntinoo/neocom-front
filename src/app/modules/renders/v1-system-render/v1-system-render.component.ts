import { Component, Input, OnInit } from '@angular/core';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { SystemLookupNode } from '../../innovative-core/domain/nodes/system-lookup.node';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

/**
 * System lookup card — same visual language as `v1-region-render`.
 * Variant `-SOLAR-SYSTEM-LOOKUP-` (orange panel). Short name: **v1-system**.
 */
@Component({
  selector: 'v1-system-render',
  templateUrl: './v1-system-render.component.html',
  styleUrl: './v1-system-render.component.scss',
})
export class V1SystemRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: SystemLookupNode;
  @Input() variant: NeoComVariant | string = NeoComVariant.SOLAR_SYSTEM_LOOKUP;

  private static registered = false;

  static ensureRegistered(): void {
    if (V1SystemRenderComponent.registered) {
      return;
    }
    registerRender('LookupSolarSystem', V1SystemRenderComponent);
    V1SystemRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1SystemRenderComponent.ensureRegistered();
  }

  getVariant(): string {
    return String(this.variant);
  }

  getName(): string {
    return this.node?.getName() ?? '-';
  }

  getBlueprintsCount(): number {
    return this.node?.getBlueprintsCount() ?? 0;
  }
}
