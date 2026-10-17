import { NgModule } from '@angular/core';
import { StandaloneNodePanelComponent } from './standalone-node-panel/standalone-node-panel.component';
import { ViewerPanelComponent } from './viewer-panel/viewer-panel.component';

/**
 * Shared panels, renders, and the viewer.
 * Support module — no root section route.
 */
@NgModule({
  imports: [ViewerPanelComponent, StandaloneNodePanelComponent],
  exports: [ViewerPanelComponent, StandaloneNodePanelComponent],
})
export class SharedModule {}
