import { Component, Input, OnInit } from '@angular/core';
import { PublicPilotV1 } from 'neocom-domain';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

/**
 * HEADER appearance `v1-public-pilot` (EPIC-004 / DOM-PILOT-003).
 * Labels stay in the markup and are not shown.
 */
@Component({
  selector: 'v1-public-pilot-render',
  templateUrl: './v1-public-pilot-render.component.html',
  styleUrl: './v1-public-pilot-render.component.scss',
})
export class V1PublicPilotRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: PublicPilotV1;
  @Input() variant: NeoComVariant | string = NeoComVariant.HEADER;

  private static registered = false;

  static ensureRegistered(): void {
    if (V1PublicPilotRenderComponent.registered) {
      return;
    }
    registerRender('PublicPilotV1', V1PublicPilotRenderComponent);
    V1PublicPilotRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1PublicPilotRenderComponent.ensureRegistered();
  }

  getNode(): PublicPilotV1 {
    return this.node;
  }

  getPilotIcon(): string {
    return this.node?.getPilotIcon() ?? 'https://images.evetech.net/characters/1/portrait?size=64';
  }

  getName(): string {
    return this.node?.getName() ?? '';
  }

  getPilotId(): number {
    return this.node?.getPilotId() ?? 0;
  }

  getAncestryLine(): string {
    return this.node?.getAncestryLine() ?? '';
  }

  getGenderDisplay(): string {
    return this.node?.getGenderDisplay() ?? '';
  }
}

V1PublicPilotRenderComponent.ensureRegistered();
