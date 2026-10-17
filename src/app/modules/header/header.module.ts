import { NgModule } from '@angular/core';
import { AppInfoPanelComponent } from './app-info-panel/app-info-panel.component';
import { ServerInfoPanelComponent } from './server-info-panel/server-info-panel.component';
import { V1PilotPanelComponent } from './v1-pilot-panel/v1-pilot-panel.component';

/**
 * Shared header panels used by core pages and section pages.
 * Not an application section — no root `loadChildren` route.
 */
@NgModule({
  imports: [AppInfoPanelComponent, ServerInfoPanelComponent, V1PilotPanelComponent],
  exports: [AppInfoPanelComponent, ServerInfoPanelComponent, V1PilotPanelComponent],
})
export class HeaderModule {}
