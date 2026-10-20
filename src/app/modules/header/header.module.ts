import { NgModule } from '@angular/core';
import { AppInfoPanelComponent } from './app-info-panel/app-info-panel.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { ServerInfoPanelComponent } from './server-info-panel/server-info-panel.component';
import { V1PilotPanelComponent } from './v1-pilot-panel/v1-pilot-panel.component';

/**
 * Shared page header controller and transitional panels.
 * Pages insert `app-page-header`; providers + renders supply ApplicationInfo / ServerStatus.
 * Not an application section — no root `loadChildren` route.
 */
@NgModule({
  imports: [
    AppInfoPanelComponent,
    ServerInfoPanelComponent,
    V1PilotPanelComponent,
    PageHeaderComponent,
  ],
  exports: [
    AppInfoPanelComponent,
    ServerInfoPanelComponent,
    V1PilotPanelComponent,
    PageHeaderComponent,
  ],
})
export class HeaderModule {}
