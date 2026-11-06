import { Component, Input } from '@angular/core';
import type { ICollaboration } from '../../innovative-core/domain/interfaces/ICollaboration.interface';
import type { AppPanelComponent } from '../../innovative-core/components/app-panel/app-panel.component';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { V2NodeContainerComponent } from '@renders/v2-node-container/v2-node-container.component';

/**
 * Presentational viewer: iterates the flat list only; does not walk the hierarchy (NODE-004, NODE-009).
 */
@Component({
  selector: 'neocom-viewer-panel',
  imports: [V2NodeContainerComponent],
  templateUrl: './viewer-panel.component.html',
  styleUrl: './viewer-panel.component.scss',
})
export class ViewerPanelComponent {
  @Input() nodes2render: ICollaboration[] = [];
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;
  @Input() downloader: AppPanelComponent | null = null;
  @Input() selectOnHover = false;

  isDownloading(): boolean {
    return this.downloader?.isDownloading() ?? true;
  }

  getNodes2Render(): ICollaboration[] {
    return this.nodes2render;
  }

  getVariant(): string {
    return this.variant;
  }
}
