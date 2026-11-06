import { Component, Input, OnInit } from '@angular/core';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { PublicCorporationV1Node } from '../../innovative-core/domain/nodes/public-corporation-v1.node';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { corporationLogoUrl } from '../../shared/eve-image-server';
import { registerRender } from '../render-registry';

/**
 * HEADER appearance `v1-corporation-render` (EPIC-006 UI-CORP).
 * Pilot-like card: logo + name [ticker] + members + tax + alliance + home path.
 */
@Component({
  selector: 'v1-corporation-render',
  templateUrl: './v1-corporation-render.component.html',
  styleUrl: './v1-corporation-render.component.scss',
})
export class V1CorporationRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: PublicCorporationV1Node;
  @Input() variant: NeoComVariant | string = NeoComVariant.HEADER;

  private static registered = false;

  static ensureRegistered(): void {
    if (V1CorporationRenderComponent.registered) {
      return;
    }
    registerRender('PublicCorporationV1', V1CorporationRenderComponent);
    V1CorporationRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1CorporationRenderComponent.ensureRegistered();
  }

  getNode(): PublicCorporationV1Node {
    return this.node;
  }

  getCorporationIcon(): string {
    return this.node?.getCorporationIcon() ?? corporationLogoUrl(null, 64);
  }

  getName(): string {
    return this.node?.getName() ?? '';
  }

  getTickerDisplay(): string {
    const ticker = this.node?.getTicker() ?? '';
    return ticker ? `[${ticker}]` : '';
  }

  getMemberCount(): number {
    return this.node?.getMemberCount() ?? 0;
  }

  getTaxRatePercent(): string {
    return this.node?.getTaxRatePercent() ?? '';
  }

  hasAlliance(): boolean {
    return this.node?.hasAlliance() ?? false;
  }

  getAllianceName(): string {
    return this.node?.getAllianceName() ?? '';
  }

  hasHomeLocation(): boolean {
    return this.node?.hasHomeLocation() ?? false;
  }

  getHomeLocationPath(): string {
    return this.node?.getHomeLocationPath() ?? '';
  }
}

V1CorporationRenderComponent.ensureRegistered();
