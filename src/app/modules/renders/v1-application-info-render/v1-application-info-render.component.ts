import { Component, Input, OnInit } from '@angular/core';
import { ApplicationInfoV1 } from 'neocom-domain';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

@Component({
  selector: 'v1-application-info-render',
  templateUrl: './v1-application-info-render.component.html',
  styleUrl: './v1-application-info-render.component.scss',
})
export class V1ApplicationInfoRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: ApplicationInfoV1;
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;

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

  getNode(): ApplicationInfoV1 {
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
}

V1ApplicationInfoRenderComponent.ensureRegistered();
