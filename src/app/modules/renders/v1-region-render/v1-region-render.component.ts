import { Component, Input, OnInit } from '@angular/core';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { RegionV1Node } from '@domain';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

/**
 * Region card — jsonClass `RegionV1` (DEF-BLP-008 / 011).
 * Paints for `-SOLAR-SYSTEM-LOOKUP-` and the list host `-BLUEPRINT-LIST-` (yellow panel).
 */
@Component({
  selector: 'v1-region-render',
  templateUrl: './v1-region-render.component.html',
  styleUrl: './v1-region-render.component.scss',
})
export class V1RegionRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: RegionV1Node;
  @Input() variant: NeoComVariant | string = NeoComVariant.SOLAR_SYSTEM_LOOKUP;
  /** Bound by `v2-node-container` via NgComponentOutlet (unused here). */
  @Input() index = 1;
  @Input() selectOnHover = false;

  static registered = false;

  static ensureRegistered(): void {
    if (V1RegionRenderComponent.registered) {
      return;
    }
    registerRender('RegionV1', V1RegionRenderComponent);
    V1RegionRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1RegionRenderComponent.ensureRegistered();
  }

  getVariant(): string {
    return String(this.variant);
  }

  /** Lookup specimens and the blueprint-by-location list both paint this card. */
  showsCard(): boolean {
    const variant = this.getVariant();
    return (
      variant === NeoComVariant.SOLAR_SYSTEM_LOOKUP ||
      variant === NeoComVariant.BLUEPRINT_LIST
    );
  }

  getName(): string {
    return this.node?.getName() ?? '-';
  }

  getSystemsCount(): number {
    return this.node?.getSystemsCount() ?? 0;
  }
}

V1RegionRenderComponent.ensureRegistered();
