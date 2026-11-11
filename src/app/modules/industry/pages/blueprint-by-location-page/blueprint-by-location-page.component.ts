import { Component, OnInit, inject, signal } from '@angular/core';
import { HeaderModule } from '../../../header/header.module';
import { V1CorporationPanelComponent } from '../../../pilot/v1-corporation-panel/v1-corporation-panel.component';
import { V1PilotPanelComponent } from '../../../pilot/v1-pilot-panel/v1-pilot-panel.component';
import { AppBreadcrumbComponent } from '../../../shared/breadcrumb/app-breadcrumb.component';
import { PilotService } from '../../../services/pilot.service';
import { NEOCOM_PILOT_ID, readCookie, writeCookie } from '../../../../security/cookie.util';
import { SessionService } from '../../../../security/session.service';
import { BlueprintByLocationPanelComponent } from '../../panels/blueprint-by-location-panel/blueprint-by-location-panel.component';

/**
 * Short name: **blueprint-by-location** (unversioned page host — UI-VER-004).
 * Pilot blueprints by location — Region → System → Blueprint (IND-BP-030…036).
 * Route `/industry/blueprints-by-location` (auth via Industry module guard).
 * Lives under `industry/pages/` (DEF-BLP-006).
 * Shell: header → pilot & corporation → breadcrumb → hierarchy (UI-SHELL-001).
 */
@Component({
  selector: 'blueprint-by-location-page',
  imports: [
    HeaderModule,
    V1PilotPanelComponent,
    V1CorporationPanelComponent,
    AppBreadcrumbComponent,
    BlueprintByLocationPanelComponent,
  ],
  templateUrl: './blueprint-by-location-page.component.html',
  styleUrl: './blueprint-by-location-page.component.scss',
  host: { class: 'neo-page' },
})
export class BlueprintByLocationPageComponent implements OnInit {
  private readonly session = inject(SessionService);
  private readonly pilots = inject(PilotService);

  protected readonly crumbs = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Blueprint Availability', route: '/industry/blueprints-by-location' },
  ];

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
