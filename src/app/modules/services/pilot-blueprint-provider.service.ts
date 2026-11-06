import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  defer,
  of,
  finalize,
  map,
  shareReplay,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { BlueprintV1Node, type BlueprintV1DtoWire } from '@domain';

const TTL_MS = 60 * 60 * 1000;

type PilotCacheEntry = {
  nodes: BlueprintV1Node[];
  expiresAt: number;
};

/**
 * Local provider for pilot blueprints (BLP-001, 003, 009…013, 024…025, DEF-BLP-003).
 * Loads from back HTTP `GET /v1/pilots/:id/blueprints` only — front SSE is parked.
 */
@Injectable({ providedIn: 'root' })
export class PilotBlueprintProviderService {
  private readonly http = inject(HttpClient);

  private readonly memory = new Map<number, PilotCacheEntry>();
  private readonly streams = new Map<number, Observable<BlueprintV1Node[]>>();

  /**
   * Shared Observable of NeoCom blueprint snapshots for a pilot.
   * Multicasted with shareReplay(1) + refCount; HTTP list only (SSE parked).
   * Errors propagate (panel may fall back to cache) — never emit a fake `[]` on failure.
   */
  observeBlueprints(pilotId: number): Observable<BlueprintV1Node[]> {
    let stream = this.streams.get(pilotId);
    if (stream) {
      return stream;
    }

    stream = defer(() => this.ensureLoaded(pilotId)).pipe(
      finalize(() => {
        this.streams.delete(pilotId);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.streams.set(pilotId, stream);
    return stream;
  }

  /** Immediate cache hit when still within TTL (BLP-025). */
  readCache(pilotId: number): BlueprintV1Node[] | null {
    const entry = this.memory.get(pilotId);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.memory.delete(pilotId);
      return null;
    }
    return entry.nodes.map((n) => BlueprintV1Node.fromDto(nodeToWire(n)));
  }

  /** Upsert one DTO into the pilot cache by blueprint id (BLP-012). */
  upsert(pilotId: number, dto: BlueprintV1DtoWire): BlueprintV1Node[] {
    return this.mergeDto(pilotId, normalizeWire(dto));
  }

  private ensureLoaded(pilotId: number): Observable<BlueprintV1Node[]> {
    const cached = this.readCache(pilotId);
    if (cached) {
      return of(cached);
    }
    return this.fetchList(pilotId).pipe(
      tap((nodes) => this.writeCache(pilotId, nodes)),
    );
  }

  private writeCache(pilotId: number, nodes: BlueprintV1Node[]): void {
    this.memory.set(pilotId, {
      nodes: nodes.map((n) => BlueprintV1Node.fromDto(nodeToWire(n))),
      expiresAt: Date.now() + TTL_MS,
    });
  }

  private fetchList(pilotId: number): Observable<BlueprintV1Node[]> {
    const url = `${environment.apiBaseUrl}/v1/pilots/${pilotId}/blueprints`;
    return this.http.get<BlueprintV1DtoWire[]>(url).pipe(
      map((dtos) => {
        if (!Array.isArray(dtos)) {
          throw new Error('Pilot blueprints response is not an array');
        }
        return dtos.map((d) => BlueprintV1Node.fromDto(normalizeWire(d)));
      }),
    );
  }

  private mergeDto(pilotId: number, dto: BlueprintV1DtoWire): BlueprintV1Node[] {
    const current = this.readCache(pilotId) ?? [];
    const node = BlueprintV1Node.fromDto(dto);
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

function nodeToWire(node: BlueprintV1Node): BlueprintV1DtoWire {
  const loc = node.getSpaceLocation();
  return {
    blueprintId: node.getBlueprintId(),
    blueprintTypeId: node.blueprintTypeId,
    blueprintTypeName: node.getName(),
    blueprintTypeIconURL: node.blueprintTypeIconURL,
    outputTypeId: node.outputTypeId,
    outputTypeName: node.outputTypeName,
    outputTypeIconURL: node.outputTypeIconURL,
    runs: node.runs,
    materialEfficiency: node.materialEfficiency,
    timeEfficiency: node.timeEfficiency,
    maxRuns: node.maxRuns,
    ready: node.ready,
    manufactureIndex: node.manufactureIndex,
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
