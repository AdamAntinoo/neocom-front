import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PilotV2 } from 'neocom-domain';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { formatIskScaled } from '../../services/pilot-from-dto';
import { registerRender } from '../render-registry';

/**
 * HEADER appearance `v2-pilot` (EPIC-004 / DOM-PILOT-006).
 * Same public lines as v1-public-pilot, plus SP, wallet, current ship.
 */
@Component({
  selector: 'v2-pilot-render',
  imports: [DecimalPipe],
  templateUrl: './v2-pilot-render.component.html',
  styleUrl: './v2-pilot-render.component.scss',
})
export class V2PilotRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: PilotV2;
  @Input() variant: NeoComVariant | string = NeoComVariant.HEADER;

  private static registered = false;

  static ensureRegistered(): void {
    if (V2PilotRenderComponent.registered) {
      return;
    }
    registerRender('PilotV2', V2PilotRenderComponent);
    V2PilotRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V2PilotRenderComponent.ensureRegistered();
  }

  getNode(): PilotV2 {
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

  getTotalSkillpoints(): number {
    return this.node?.getTotalSkillpoints() ?? 0;
  }

  getWalletLabel(): string {
    return formatIskScaled(this.node?.getWalletBalance() ?? 0);
  }

  getCurrentShipName(): string {
    return this.node?.getCurrentShipName() ?? '';
  }
}

V2PilotRenderComponent.ensureRegistered();
