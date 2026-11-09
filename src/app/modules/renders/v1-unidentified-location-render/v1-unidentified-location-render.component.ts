import { Component, Input, OnInit } from '@angular/core';
import { NeoCom } from '../../innovative-core/domain/NeoCom';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { UnidentifiedLocationV1Node } from '../../innovative-core/domain/nodes/unidentified-location-v1.node';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

/**
 * Unidentified location hierarchy row (FAL-025).
 * Similar to Region/System chrome; **no dedicated icon** (drawable deferred).
 */
@Component({
  selector: 'v1-unidentified-location-render',
  templateUrl: './v1-unidentified-location-render.component.html',
  styleUrl: './v1-unidentified-location-render.component.scss',
})
export class V1UnidentifiedLocationRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: NeoCom;
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;
  /** Bound by `v2-node-container` via NgComponentOutlet (unused here). */
  @Input() index = 1;
  @Input() selectOnHover = false;

  static registered = false;

  static ensureRegistered(): void {
    if (V1UnidentifiedLocationRenderComponent.registered) {
      return;
    }
    registerRender('UnidentifiedLocationV1', V1UnidentifiedLocationRenderComponent);
    V1UnidentifiedLocationRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1UnidentifiedLocationRenderComponent.ensureRegistered();
  }

  getPlace(): UnidentifiedLocationV1Node | undefined {
    return this.node instanceof UnidentifiedLocationV1Node ? this.node : undefined;
  }

  getName(): string {
    return this.getPlace()?.getName() ?? '-';
  }

  getAssetCount(): number {
    return this.getPlace()?.getAssetCount() ?? 0;
  }
}

V1UnidentifiedLocationRenderComponent.ensureRegistered();
