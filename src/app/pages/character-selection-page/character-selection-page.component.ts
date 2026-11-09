import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderModule } from '../../modules/header/header.module';
import { NeoComVariant } from '../../modules/innovative-core/domain/NeoComVariant';
import { V1PilotPanelComponent } from '../../modules/pilot/v1-pilot-panel/v1-pilot-panel.component';
import {
  StoredCharacter,
  listStoredCharacters,
  rememberStoredCharacter,
} from '../../security/stored-characters';
import { SessionService } from '../../security/session.service';
import { writeCookie, NEOCOM_PILOT_ID } from '../../security/cookie.util';

/**
 * Pre-Dashboard character selection (UI-CHAR-002).
 * Lists stored characters with pilot LIST render patterns / PilotV2 panel.
 */
@Component({
  selector: 'character-selection-page',
  imports: [HeaderModule, V1PilotPanelComponent],
  templateUrl: './character-selection-page.component.html',
  styleUrl: './character-selection-page.component.scss',
  host: { class: 'neo-page' },
})
export class CharacterSelectionPageComponent implements OnInit {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  protected readonly Variant = NeoComVariant;
  protected readonly characters = signal<StoredCharacter[]>([]);
  protected readonly activeId = signal<number | null>(null);

  ngOnInit(): void {
    if (!this.session.hasAccess()) {
      void this.router.navigateByUrl('/login');
      return;
    }
    const access = this.session.getAccess()!;
    rememberStoredCharacter({
      characterId: access.characterId,
      characterName: access.characterName,
    });
    this.characters.set(listStoredCharacters());
    this.activeId.set(access.characterId);
  }

  protected select(character: StoredCharacter): void {
    this.session.selectStoredCharacter(character.characterName, character.characterId);
    writeCookie(NEOCOM_PILOT_ID, String(character.characterId), 60 * 60 * 24 * 30);
    this.activeId.set(character.characterId);
    void this.router.navigateByUrl('/dashboard');
  }
}
