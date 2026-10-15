import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { PilotV1 } from './pilot-v1';

@Injectable()
export class PilotService {
  private readonly http = inject(HttpClient);

  getPilot(pilotId: number, authorization?: string): Observable<PilotV1> {
    const headers =
      authorization !== undefined && authorization.trim().length > 0
        ? new HttpHeaders({ Authorization: authorization })
        : undefined;
    return this.http.get<PilotV1>(`${environment.apiBaseUrl}/v1/pilots/${pilotId}`, { headers });
  }
}
