import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SpaceLocationNodeV1,
  type SpaceLocationV1DtoWire,
} from '../innovative-core/domain/nodes/space-location-v1.node';

/**
 * Resolves place info via backend spacelocations (FAL-034 / FAL-035).
 * `GET /api/v1/universe/spacelocations/{locationId}`.
 */
@Injectable({ providedIn: 'root' })
export class SpaceLocationService {
  private readonly http = inject(HttpClient);
  private readonly memory = new Map<number, SpaceLocationNodeV1>();
  private readonly inflight = new Map<number, Observable<SpaceLocationNodeV1 | null>>();

  /** Cached lookup; returns null when the backend has no usable entry. */
  resolve(locationId: number): Observable<SpaceLocationNodeV1 | null> {
    if (!Number.isFinite(locationId) || locationId <= 0) {
      return of(null);
    }
    const cached = this.memory.get(locationId);
    if (cached) {
      return of(cached);
    }
    let stream = this.inflight.get(locationId);
    if (stream) {
      return stream;
    }
    const url = `${environment.apiPrefix}/v1/universe/spacelocations/${locationId}`;
    stream = this.http.get<SpaceLocationV1DtoWire>(url).pipe(
      map((dto) => SpaceLocationNodeV1.fromDto(dto) ?? null),
      tap((node) => {
        if (node) {
          this.memory.set(locationId, node);
        }
      }),
      catchError(() => of(null)),
      finalize(() => {
        this.inflight.delete(locationId);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.inflight.set(locationId, stream);
    return stream;
  }
}
