import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { V1CorporationRenderComponent } from '@renders/v1-corporation-render/v1-corporation-render.component';
import { PublicCorporationService } from '../../services/public-corporation.service';

/**
 * Host for `v1-corporation-render` to the right of the pilot panel (UI-CORP-001).
 * Corporation id comes from the selected Pilot (UI-CORP-003).
 */
@Component({
  selector: 'v1-corporation-panel',
  imports: [V1CorporationRenderComponent],
  templateUrl: './v1-corporation-panel.component.html',
  styleUrl: './v1-corporation-panel.component.scss',
})
export class V1CorporationPanelComponent {
  private readonly corporations = inject(PublicCorporationService);

  /** Corporation id from PilotV2 / PublicPilot corporation link. */
  readonly corporationId = input(0);

  readonly node = toSignal(
    toObservable(this.corporationId).pipe(
      switchMap((id) => (id > 0 ? this.corporations.getPublicCorporation(id) : of(undefined))),
    ),
  );

  readonly headerVariant = NeoComVariant.HEADER;
}
