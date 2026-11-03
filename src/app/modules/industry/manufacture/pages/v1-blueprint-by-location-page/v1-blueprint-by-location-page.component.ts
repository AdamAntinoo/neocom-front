import { Component, inject } from '@angular/core';
import { HeaderModule } from '../../../../header/header.module';
import { AppBreadcrumbComponent } from '../../../../shared/breadcrumb/app-breadcrumb.component';
import { NEOCOM_PILOT_ID, readCookie } from '../../../../../security/cookie.util';
import { SessionService } from '../../../../../security/session.service';
import { BlueprintByLocationPanelComponent } from '../../panels/blueprint-by-location-panel/blueprint-by-location-panel.component';

/**
 * Short name: **v1-blueprint-by-location**.
 * Pilot blueprints by location — Region → System → Blueprint (IND-BP-030…036).
 * Route `/industry/blueprints-by-location` (auth via Industry module guard).
 */
@Component({
  selector: 'v1-blueprint-by-location-page',
  imports: [HeaderModule, AppBreadcrumbComponent, BlueprintByLocationPanelComponent],
  templateUrl: './v1-blueprint-by-location-page.component.html',
  styleUrl: './v1-blueprint-by-location-page.component.scss',
  host: { class: 'neo-page' },
})
export class V1BlueprintByLocationPageComponent {
  private readonly session = inject(SessionService);

  protected readonly crumbs = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Industry', route: '/industry' },
    { label: 'Blueprint Availability', route: '/industry/blueprints-by-location' },
  ];

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
