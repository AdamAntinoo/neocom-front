import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerStatusV1 } from 'neocom-domain';
import { ServerStatusV1Node } from '../../innovative-core/domain/nodes/server-status-v1.node';

/**
 * Locates ServerStatusV1Node for the header controller (UI-HDR-007, SRV-001).
 * Wire model is neocom-domain ServerStatusV1; the node is the NeoCom render type.
 */
@Injectable({ providedIn: 'root' })
export class ServerStatusProvider {
  public getServerStatus(): Observable<ServerStatusV1Node | null> {
    return of(
      ServerStatusV1Node.from(
        new ServerStatusV1({
          server: 'tranquility',
          players: 0,
          backendVersion: '—',
          SDEVersion: '—',
          nextDowntime: '—',
        }),
      ),
    );
  }
}
