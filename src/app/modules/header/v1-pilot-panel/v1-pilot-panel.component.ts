import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import type { PilotV2, PublicPilotV1 } from 'neocom-domain';
import { catchError, of, switchMap, tap } from 'rxjs';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import {
  PilotV2Node,
  type PublicPilotV1Node,
} from '../../innovative-core/domain/nodes';
import { V1PublicPilotRenderComponent } from '../../renders/v1-public-pilot-render/v1-public-pilot-render.component';
import { V2PilotRenderComponent } from '../../renders/v2-pilot-render/v2-pilot-render.component';
import { PilotService } from '../../services/pilot.service';
import { SessionService } from '../../../security/session.service';

export type PilotPanelVariantMode = 'auto' | 'public' | 'private' | 'list';

@Component({
  selector: 'v1-pilot-panel',
  imports: [V1PublicPilotRenderComponent, V2PilotRenderComponent],
  templateUrl: './v1-pilot-panel.component.html',
  styleUrl: './v1-pilot-panel.component.scss',
})
export class V1PilotPanelComponent {
  private readonly pilots = inject(PilotService);
  private readonly session = inject(SessionService);

  /** EVE character id (PANEL-002). */
  readonly identifier = input(93813310);
  /**
   * Panel presentation mode.
   * `auto` picks private when a credential is present and the wire is PilotV2; otherwise public.
   */
  readonly variant = input<PilotPanelVariantMode>('auto');
  /** When `list`, mark this row as the current active pilot (PANEL-009). */
  readonly active = input(false);

  readonly loadError = signal<string | undefined>(undefined);

  /** NeoCom pilot node from neocom-back wire JSON. */
  readonly pilot = toSignal(
    toObservable(this.identifier).pipe(
      switchMap((pilotId) => {
        const token = this.session.getAccess()?.accessToken;
        const authorization = token ? `Bearer ${token}` : undefined;
        return this.pilots.getPilot(pilotId, authorization).pipe(
          tap(() => this.loadError.set(undefined)),
          catchError(() => {
            this.loadError.set('The pilot could not be loaded.');
            return of(undefined as PublicPilotV1Node | PilotV2Node | undefined);
          }),
        );
      }),
    ),
  );

  readonly hasCredential = computed(
    () => (this.session.getAccess()?.accessToken?.trim().length ?? 0) > 0,
  );

  readonly effectiveMode = computed((): Exclude<PilotPanelVariantMode, 'auto'> => {
    const mode = this.variant();
    if (mode !== 'auto') {
      return mode;
    }
    const node = this.pilot();
    if (this.hasCredential() && node instanceof PilotV2Node) {
      return 'private';
    }
    return 'public';
  });

  /** Private fields only when credential is available (PANEL-003). */
  readonly showPrivate = computed(
    () =>
      this.effectiveMode() === 'private' &&
      this.hasCredential() &&
      this.pilot() instanceof PilotV2Node,
  );

  readonly showList = computed(() => this.effectiveMode() === 'list');

  /** Render code token (PANEL-006…008); falls back to public when private is hidden. */
  readonly variantCode = computed((): NeoComVariant => {
    if (this.showList()) {
      return NeoComVariant.PILOT_LIST;
    }
    if (this.showPrivate()) {
      return NeoComVariant.PILOT;
    }
    return NeoComVariant.PILOT_PUBLIC;
  });

  readonly listActive = computed(() => this.showList() && this.active());

  readonly publicRecord = computed((): PublicPilotV1 | undefined => {
    const node = this.pilot();
    if (node == null || this.showPrivate() || this.showList()) {
      return undefined;
    }
    return node.getRecord();
  });

  readonly privateRecord = computed((): PilotV2 | undefined => {
    const node = this.pilot();
    if (!this.showPrivate() || !(node instanceof PilotV2Node)) {
      return undefined;
    }
    return node.getRecord();
  });
}
