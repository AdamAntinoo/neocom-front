import { NgModule } from '@angular/core';
import { V1BlueprintRenderComponent } from './v1-blueprint-render/v1-blueprint-render.component';
import { V2NodeContainerComponent } from './v2-node-container/v2-node-container.component';

/**
 * Render components for industry and later sections.
 * Support module — no root section route.
 */
@NgModule({
  imports: [V2NodeContainerComponent, V1BlueprintRenderComponent],
  exports: [V2NodeContainerComponent, V1BlueprintRenderComponent],
})
export class RendersModule {}
