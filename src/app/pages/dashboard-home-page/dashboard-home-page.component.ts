import { Component } from '@angular/core';
import { AppInfoPanelComponent } from '../../panels/app-info-panel/app-info-panel.component';
import { ServerInfoPanelComponent } from '../../panels/server-info-panel/server-info-panel.component';
import { V1PilotPanelComponent } from '../../panels/v1-pilot-panel/v1-pilot-panel.component';

/**
 * Application start page.
 *
 * ROW 1 — application header and current server status.
 * ROW 2 — current pilot.
 *
 * Sections and fields are marked with cy catalog attributes. The registry is
 * docs/ui-component-catalog.md.
 */
@Component({
  selector: 'dashboard-home-page',
  imports: [AppInfoPanelComponent, ServerInfoPanelComponent, V1PilotPanelComponent],
  templateUrl: './dashboard-home-page.component.html',
  styleUrl: './dashboard-home-page.component.scss',
})
export class DashboardHomePageComponent {
  protected exception: { title: string; message: string } | null = null;

  protected getPilotId(): number {
    return 93813310;
  }
}
