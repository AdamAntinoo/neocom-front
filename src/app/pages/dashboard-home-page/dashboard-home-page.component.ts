import { Component, OnInit, inject, signal } from '@angular/core';
import { HeaderModule } from '../../modules/header/header.module';
import { V1CorporationPanelComponent } from '../../modules/header/v1-corporation-panel/v1-corporation-panel.component';
import { AppBreadcrumbComponent } from '../../modules/shared/breadcrumb/app-breadcrumb.component';
import { FeatureListPanelComponent } from '../../modules/shared/feature-list-panel/feature-list-panel.component';
import { PilotService } from '../../modules/services/pilot.service';
import { NEOCOM_PILOT_ID, readCookie, writeCookie } from '../../security/cookie.util';
import { SessionService } from '../../security/session.service';

/**
 * Application Dashboard (UI-DASH).
 *
 * Rows: `app-page-header` → pilot & corporation → breadcrumb → feature list.
 */
@Component({
  selector: 'dashboard-home-page',
  imports: [
    HeaderModule,
    V1CorporationPanelComponent,
    AppBreadcrumbComponent,
    FeatureListPanelComponent,
  ],
  templateUrl: './dashboard-home-page.component.html',
  styleUrl: './dashboard-home-page.component.scss',
  host: { class: 'neo-page' },
})
export class DashboardHomePageComponent implements OnInit {
  private readonly session = inject(SessionService);
  private readonly pilots = inject(PilotService);

  protected exception: { title: string; message: string } | null = null;

  protected readonly crumbs = [{ label: 'Dashboard', route: '/dashboard' }];

  protected readonly corporationId = signal(0);

  ngOnInit(): void {
    const pilotId = this.getPilotId();
    writeCookie(NEOCOM_PILOT_ID, String(pilotId), 60 * 60 * 24 * 30);
    this.pilots.getPilot(pilotId).subscribe({
      next: (node) => this.corporationId.set(node.getCorporationId()),
      error: () => this.corporationId.set(0),
    });
  }

  protected getPilotId(): number {
    const fromSession = this.session.getAccess()?.characterId;
    if (fromSession != null && Number.isFinite(fromSession)) {
      return fromSession;
    }
    const fromCookie = Number(readCookie(NEOCOM_PILOT_ID));
    if (Number.isFinite(fromCookie) && fromCookie > 0) {
      return fromCookie;
    }
    return 93813310;
  }
}
