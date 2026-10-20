import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerStatusV1 } from 'neocom-domain';

/**
 * Locates ServerStatusV1 for the header controller (UI-HDR-007, SRV-001).
 * Placeholder instance until the backend status API is wired.
 */
@Injectable({ providedIn: 'root' })
export class ServerStatusProvider {
  public getServerStatus(): Observable<ServerStatusV1 | null> {
    return of(
      new ServerStatusV1({
        server: 'Tranquility',
        players: 0,
        backendVersion: '—',
        SDEVersion: '—',
        startAgo: '—',
        nextDowntime: '—',
      }),
    );
  }
}
