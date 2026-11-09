import { Component, inject } from '@angular/core';
import { HeaderModule } from '../../../header/header.module';
import { AppBreadcrumbComponent } from '../../../shared/breadcrumb/app-breadcrumb.component';
import { NEOCOM_PILOT_ID, readCookie } from '../../../../security/cookie.util';
import { SessionService } from '../../../../security/session.service';
import { AssetsByLocationPanelComponent } from '../../panels/assets-by-location-panel/assets-by-location-panel.component';

/**
 * Short name: **assets-by-location** (FAL-010…011).
 * Route `/pilot/assets-by-location`.
 */
@Component({
  selector: 'assets-by-location-page',
  imports: [HeaderModule, AppBreadcrumbComponent, AssetsByLocationPanelComponent],
  templateUrl: './assets-by-location-page.component.html',
  styleUrl: './assets-by-location-page.component.scss',
  host: { class: 'neo-page' },
})
export class AssetsByLocationPageComponent {
  private readonly session = inject(SessionService);

  protected readonly crumbs = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Assets by Location', route: '/pilot/assets-by-location' },
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
