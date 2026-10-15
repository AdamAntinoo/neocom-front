import { Component, inject } from '@angular/core';
import { AppInfoPanelComponent } from '../../panels/app-info-panel/app-info-panel.component';
import { ServerInfoPanelComponent } from '../../panels/server-info-panel/server-info-panel.component';
import { V1PilotPanelComponent } from '../../panels/v1-pilot-panel/v1-pilot-panel.component';
import { SessionService } from '../../security/session.service';

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
  private readonly session = inject(SessionService);

  protected exception: { title: string; message: string } | null = null;

  protected getPilotId(): number {
    return this.session.getAccess()?.characterId ?? 93813310;
  }

  /** LOGIN-006 — switch active character without a new SSO login. */
  protected selectCharacter(characterName: string, characterId: number): void {
    this.session.selectStoredCharacter(characterName, characterId);
  }
}
