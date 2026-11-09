import { NgModule } from '@angular/core';
import { AppInfoPanelComponent } from './app-info-panel/app-info-panel.component';
import { AppPageHeaderComponent } from './app-page-header/app-page-header.component';
import { ApplicationInfoProvider } from './providers/application-info.provider';
import { ServerStatusProvider } from './providers/server-status.provider';
import { ServerInfoPanelComponent } from './server-info-panel/server-info-panel.component';

/**
 * Shared page header controller and transitional panels.
 * Pilot / corporation panels live in {@link PilotModule} (FAL-015).
 * Not an application section — no root `loadChildren` route.
 */
@NgModule({
  imports: [AppInfoPanelComponent, ServerInfoPanelComponent, AppPageHeaderComponent],
  exports: [AppInfoPanelComponent, ServerInfoPanelComponent, AppPageHeaderComponent],
  providers: [ApplicationInfoProvider, ServerStatusProvider],
})
export class HeaderModule {}
