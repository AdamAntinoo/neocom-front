import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  defer,
  of,
  catchError,
  finalize,
  map,
  shareReplay,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BlueprintNodeV1,
  type BlueprintV1DtoWire,
} from '../innovative-core/domain/nodes/blueprint-node-v1';
import { AuthenticatedSseClient } from './authenticated-sse.client';

const TTL_MS = 60 * 60 * 1000;

type PilotCacheEntry = {
  nodes: BlueprintNodeV1[];
  expiresAt: number;
};

/**
 * Local provider for pilot blueprints (BLP-001…003, 009…013, 021…025).
 * Owns HTTP list + SSE; panels subscribe via {@link observeBlueprints}.
 */
@Injectable({ providedIn: 'root' })
export class PilotBlueprintProviderService {
  private readonly http = inject(HttpClient);
  private readonly sse = inject(AuthenticatedSseClient);

  private readonly memory = new Map<number, PilotCacheEntry>();
  private readonly streams = new Map<number, Observable<BlueprintNodeV1[]>>();

  /**
   * Shared Observable of NeoCom blueprint snapshots for a pilot (BLP-021).
   * Multicasted with shareReplay(1) + refCount; one SSE while subscribers > 0.
   */
  observeBlueprints(pilotId: number): Observable<BlueprintNodeV1[]> {
    let stream = this.streams.get(pilotId);
    if (stream) {
      return stream;
    }

    stream = defer(() => this.ensureLoaded(pilotId)).pipe(
      catchError(() => of([] as BlueprintNodeV1[])),
      (source) => this.withSse(pilotId, source),
      finalize(() => {
        this.streams.delete(pilotId);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.streams.set(pilotId, stream);
    return stream;
  }

  /** Immediate cache hit when still within TTL (BLP-010 / BLP-025). */
  readCache(pilotId: number): BlueprintNodeV1[] | null {
    const entry = this.memory.get(pilotId);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.memory.delete(pilotId);
      return null;
    }
    return entry.nodes.map((n) => BlueprintNodeV1.fromDto(nodeToWire(n)));
  }

  /** Upsert one DTO into the pilot cache by blueprint id (BLP-012). */
  upsert(pilotId: number, dto: BlueprintV1DtoWire): BlueprintNodeV1[] {
    return this.mergeDto(pilotId, normalizeWire(dto));
  }

  private withSse(
    pilotId: number,
    source: Observable<BlueprintNodeV1[]>,
  ): Observable<BlueprintNodeV1[]> {
    return new Observable<BlueprintNodeV1[]>((subscriber) => {
      let sseSub: { unsubscribe(): void } | null = null;
      const outer = source.subscribe({
        next: (initial) => {
          subscriber.next(initial);
          sseSub?.unsubscribe();
          sseSub = this.openSse(pilotId).subscribe({
            next: (snap) => subscriber.next(snap),
            error: () => {
              /* SSE optional once list painted */
            },
          });
        },
        error: (err) => subscriber.error(err),
      });
      return () => {
        outer.unsubscribe();
        sseSub?.unsubscribe();
      };
    });
  }

  private ensureLoaded(pilotId: number): Observable<BlueprintNodeV1[]> {
    const cached = this.readCache(pilotId);
    if (cached) {
      return of(cached);
    }
    return this.fetchList(pilotId).pipe(
      tap((nodes) => this.writeCache(pilotId, nodes)),
      catchError(() => of([])),
    );
  }

  private openSse(pilotId: number): Observable<BlueprintNodeV1[]> {
    const base = environment.sseBasePath || `${environment.apiBaseUrl}/v1`;
    const url = `${base}/pilots/${pilotId}/manufacture/blueprints/events`;
    return new Observable<BlueprintNodeV1[]>((subscriber) => {
      const sub = this.sse.open(url).subscribe({
        next: (evt) => {
          if (evt.type !== 'node-updated' && evt.type !== 'message') {
            return;
          }
          try {
            const payload = JSON.parse(evt.data) as {
              nodeId?: string;
              node?: BlueprintV1DtoWire;
            };
            if (!payload.node) {
              return;
            }
            subscriber.next(this.mergeDto(pilotId, normalizeWire(payload.node)));
          } catch {
            /* ignore malformed */
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
      return () => sub.unsubscribe();
    });
  }

  private writeCache(pilotId: number, nodes: BlueprintNodeV1[]): void {
    this.memory.set(pilotId, {
      nodes: nodes.map((n) => BlueprintNodeV1.fromDto(nodeToWire(n))),
      expiresAt: Date.now() + TTL_MS,
    });
  }

  private fetchList(pilotId: number): Observable<BlueprintNodeV1[]> {
    const url = `${environment.apiBaseUrl}/v1/pilots/${pilotId}/blueprints`;
    return this.http.get<BlueprintV1DtoWire[]>(url).pipe(
      map((dtos) => dtos.map((d) => BlueprintNodeV1.fromDto(normalizeWire(d)))),
    );
  }

  private mergeDto(pilotId: number, dto: BlueprintV1DtoWire): BlueprintNodeV1[] {
    const current = this.readCache(pilotId) ?? [];
    const node = BlueprintNodeV1.fromDto(dto);
    const next = [...current];
    const idx = next.findIndex((n) => n.getId() === node.getId());
    if (idx >= 0) {
      next[idx] = node;
    } else {
      next.push(node);
    }
    this.writeCache(pilotId, next);
    return next;
  }
}

function normalizeWire(dto: BlueprintV1DtoWire): BlueprintV1DtoWire {
  const flat = dto as BlueprintV1DtoWire & {
    regionId?: number;
    regionName?: string;
    solarSystemId?: number;
    solarSystemName?: string;
  };
  if (dto.location == null && flat.regionName) {
    return {
      ...dto,
      blueprintTypeName: dto.blueprintTypeName ?? dto.name,
      location: {
        regionId: flat.regionId,
        regionName: flat.regionName,
        solarSystemId: flat.solarSystemId,
        solarSystemName: flat.solarSystemName,
      },
    };
  }
  if (!dto.blueprintTypeName && dto.name) {
    return { ...dto, blueprintTypeName: dto.name };
  }
  return dto;
}

function nodeToWire(node: BlueprintNodeV1): BlueprintV1DtoWire {
  const loc = node.getSpaceLocation();
  return {
    blueprintId: node.getBlueprintId(),
    blueprintTypeId: node.blueprintTypeId,
    blueprintTypeName: node.getName(),
    blueprintTypeIconURL: node.blueprintTypeIconURL,
    runs: node.runs,
    materialEfficiency: node.materialEfficiency,
    timeEfficiency: node.timeEfficiency,
    maxRuns: node.maxRuns,
    location: loc
      ? {
          locationId: loc.locationId,
          locationType: loc.locationType,
          regionId: loc.regionId,
          regionName: loc.regionName,
          solarSystemId: loc.solarSystemId,
          solarSystemName: loc.solarSystemName,
          stationId: loc.stationId,
          stationName: loc.stationName,
        }
      : undefined,
  };
}
