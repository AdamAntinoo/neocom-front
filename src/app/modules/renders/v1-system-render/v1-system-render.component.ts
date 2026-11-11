import { Component, Input, OnInit } from '@angular/core';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { SolarSystemV1Node } from '@domain';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

/**
 * Solar system card — jsonClass `SolarSystemV1` (DEF-BLP-008 / 011).
 * Paints for `-SOLAR-SYSTEM-LOOKUP-` and the list host `-BLUEPRINT-LIST-` (orange panel).
 * Short name: **v1-system**.
 */
@Component({
  selector: 'v1-system-render',
  templateUrl: './v1-system-render.component.html',
  styleUrl: './v1-system-render.component.scss',
})
export class V1SystemRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: SolarSystemV1Node;
  @Input() variant: NeoComVariant | string = NeoComVariant.SOLAR_SYSTEM_LOOKUP;
  /** Bound by `v2-node-container` via NgComponentOutlet (unused here). */
  @Input() index = 1;
  @Input() selectOnHover = false;

  static registered = false;

  static ensureRegistered(): void {
    if (V1SystemRenderComponent.registered) {
      return;
    }
    registerRender('SolarSystemV1', V1SystemRenderComponent);
    V1SystemRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1SystemRenderComponent.ensureRegistered();
  }

  getVariant(): string {
    return String(this.variant);
  }

  /** Lookup specimens and the blueprint-by-location list both paint this card. */
  showsCard(): boolean {
    const variant = this.getVariant();
    return (
      variant === NeoComVariant.SOLAR_SYSTEM_LOOKUP || variant === NeoComVariant.BLUEPRINT_LIST
    );
  }

  getName(): string {
    return this.node?.getName() ?? '-';
  }

  getBlueprintsCount(): number {
    return this.node?.getBlueprintsCount() ?? 0;
  }
}

V1SystemRenderComponent.ensureRegistered();
