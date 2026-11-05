import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { ApplicationInfoV1Node } from '../../innovative-core/domain/nodes/application-info-v1.node';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

@Component({
  selector: 'v1-application-info-render',
  templateUrl: './v1-application-info-render.component.html',
  styleUrl: './v1-application-info-render.component.scss',
})
export class V1ApplicationInfoRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: ApplicationInfoV1Node;
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;

  private readonly router = inject(Router);
  private static registered = false;

  static ensureRegistered(): void {
    if (V1ApplicationInfoRenderComponent.registered) {
      return;
    }
    registerRender('ApplicationInfoV1', V1ApplicationInfoRenderComponent);
    V1ApplicationInfoRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1ApplicationInfoRenderComponent.ensureRegistered();
  }

  getNode(): ApplicationInfoV1Node {
    return this.node;
  }

  getName(): string {
    return this.getNode()?.getName()?.toUpperCase() ?? '';
  }

  getVersion(): string {
    return this.getNode()?.getVersion() ?? '';
  }

  getCopyright(): string {
    return this.getNode()?.getCopyright() ?? '';
  }

  /** UI-AIP-006 — name control only navigates to character selection. */
  goToCharacterSelection(): void {
    void this.router.navigateByUrl('/character-selection');
  }
}

V1ApplicationInfoRenderComponent.ensureRegistered();
