import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  pilotNodeFromWire,
  type PilotV2Node,
  type PublicPilotV1Node,
} from '../innovative-core/domain/nodes';

@Injectable()
export class PilotService {
  private readonly http = inject(HttpClient);

  getPilot(
    pilotId: number,
    authorization?: string,
  ): Observable<PublicPilotV1Node | PilotV2Node> {
    const headers =
      authorization !== undefined && authorization.trim().length > 0
        ? new HttpHeaders({ Authorization: authorization })
        : undefined;
    return this.http
      .get<object>(`${environment.apiBaseUrl}/v1/pilots/${pilotId}`, { headers })
      .pipe(map((raw) => pilotNodeFromWire(raw)));
  }
}
