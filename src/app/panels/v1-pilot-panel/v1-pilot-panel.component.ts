import { Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { PilotService } from '../../modules/services/pilot.service';
import type { PilotV1 } from '../../modules/services/pilot-v1';

@Component({
  selector: 'v1-pilot-panel',
  templateUrl: './v1-pilot-panel.component.html',
  styleUrl: './v1-pilot-panel.component.scss',
})
export class V1PilotPanelComponent {
  private readonly pilots = inject(PilotService);
  readonly identifier = input(93813310);
  readonly loadError = signal<string | undefined>(undefined);
  /** PilotV1Dto returned by neocom-back. */
  readonly pilot = toSignal(
    toObservable(this.identifier).pipe(
      switchMap((pilotId) =>
        this.pilots.getPilot(pilotId).pipe(
          tap(() => this.loadError.set(undefined)),
          catchError(() => {
            this.loadError.set('The pilot could not be loaded.');
            return of(undefined as PilotV1 | undefined);
          }),
        ),
      ),
    ),
  );
}
