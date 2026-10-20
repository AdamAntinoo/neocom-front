import { Component, inject } from '@angular/core';
import { HeaderModule } from '../../modules/header/header.module';
import { SessionService } from '../../security/session.service';

/**
 * Application start page.
 *
 * ROW 1 — `<app-page-header />` (`-APP-` variant; internals hidden from this page).
 * ROW 2 — current pilot.
 *
 * Sections and fields are marked with cy catalog attributes. The registry is
 * docs/cy-tags-and-styles.md (see also docs/ui-component-catalog.md).
 */
@Component({
  selector: 'dashboard-home-page',
  imports: [HeaderModule],
  templateUrl: './dashboard-home-page.component.html',
  styleUrl: './dashboard-home-page.component.scss',
  host: { class: 'neo-page' },
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
