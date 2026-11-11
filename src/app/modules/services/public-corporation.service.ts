import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PublicCorporationV1Node,
  type PublicCorporationWire,
} from '../innovative-core/domain/nodes/public-corporation-v1.node';

/**
 * NeoCom public corporation provider (UI-CORP-002 / UI-CORP-012).
 * Front never calls ESI — only NeoCom `/v1/corporations/{id}` (or fixture fallback).
 */
@Injectable({ providedIn: 'root' })
export class PublicCorporationService {
  private readonly http = inject(HttpClient);

  getPublicCorporation(corporationId: number): Observable<PublicCorporationV1Node> {
    if (!Number.isFinite(corporationId) || corporationId <= 0) {
      return of(PublicCorporationV1Node.from({ corporationId: 1, name: 'Unknown', ticker: 'UNK' }));
    }
    return this.http
      .get<PublicCorporationWire>(`${environment.apiBaseUrl}/v1/corporations/${corporationId}`)
      .pipe(
        map((wire) =>
          PublicCorporationV1Node.from({
            ...wire,
            corporationId: wire.corporationId ?? corporationId,
          }),
        ),
        catchError(() => of(this.fixtureFor(corporationId))),
      );
  }

  /** Dev / offline specimen until back public-corp endpoint is live. */
  private fixtureFor(corporationId: number): PublicCorporationV1Node {
    return PublicCorporationV1Node.from({
      corporationId,
      name: 'Industrial Freeholders',
      ticker: 'INDFH',
      memberCount: 42,
      taxRate: 0.05,
      allianceId: 99003214,
      allianceName: 'Pan-Intergalactic Business Community',
      homeStationId: 60003760,
      homeLocationPath:
        'Jita IV - Moon 4 - Caldari Navy Assembly Plant >> Jita >> Kimotoro >> The Forge',
    });
  }
}
