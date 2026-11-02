import { NgModule } from '@angular/core';
import { V1ApplicationInfoRenderComponent } from './v1-application-info-render/v1-application-info-render.component';
import { V1BlueprintRenderComponent } from './v1-blueprint-render/v1-blueprint-render.component';
import { V1PublicPilotRenderComponent } from './v1-public-pilot-render/v1-public-pilot-render.component';
import { V1ServerStatusRenderComponent } from './v1-server-status-render/v1-server-status-render.component';
import { V2NodeContainerComponent } from './v2-node-container/v2-node-container.component';
import { V2PilotRenderComponent } from './v2-pilot-render/v2-pilot-render.component';

/**
 * Versioned render components (`vn-`) for industry, header, and later sections.
 * Support module — no root section route.
 */
@NgModule({
  imports: [
    V2NodeContainerComponent,
    V1BlueprintRenderComponent,
    V1ApplicationInfoRenderComponent,
    V1ServerStatusRenderComponent,
    V1PublicPilotRenderComponent,
    V2PilotRenderComponent,
  ],
  exports: [
    V2NodeContainerComponent,
    V1BlueprintRenderComponent,
    V1ApplicationInfoRenderComponent,
    V1ServerStatusRenderComponent,
    V1PublicPilotRenderComponent,
    V2PilotRenderComponent,
  ],
})
export class RendersModule {}