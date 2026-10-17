import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProcessedBlueprint } from '../industry/domain/processed-blueprint';
import { AuthenticatedSseClient } from './authenticated-sse.client';

export type BlueprintDto = {
  jsonClass?: string;
  blueprintId: number;
  name: string;
  ready: boolean;
  manufactureIndex: number | null;
  marketCost?: number | null;
  manufactureCost?: number | null;
};

/**
 * Front adapter: cache first, then HTTP, then SSE merge (FASSE-002…008, FASSE-010).
 */
@Injectable({ providedIn: 'root' })
export class NodeListAdapterService {
  private readonly http = inject(HttpClient);
  private readonly sse = inject(AuthenticatedSseClient);
  private readonly memory = new Map<string, ProcessedBlueprint[]>();
  private readonly storageKeyPrefix = 'neocom.nodelist.';

  cacheKey(pilotId: number): string {
    return `pilot:${pilotId}:manufacture-blueprints`;
  }

  /** Immediate cache hit (session memory, then optional localStorage). */
  readCache(pilotId: number): ProcessedBlueprint[] | null {
    const key = this.cacheKey(pilotId);
    const mem = this.memory.get(key);
    if (mem) {
      return mem.map(cloneBlueprint);
    }
    try {
      const raw = localStorage.getItem(this.storageKeyPrefix + key);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as BlueprintDto[];
      const nodes = parsed.map(dtoToNode);
      this.memory.set(key, nodes);
      return nodes.map(cloneBlueprint);
    } catch {
      return null;
    }
  }

  writeCache(pilotId: number, nodes: ProcessedBlueprint[]): void {
    const key = this.cacheKey(pilotId);
    const copy = nodes.map(cloneBlueprint);
    this.memory.set(key, copy);
    try {
      localStorage.setItem(this.storageKeyPrefix + key, JSON.stringify(copy.map(nodeToDto)));
    } catch {
      /* quota / private mode */
    }
  }

  /**
   * Single entry for list fetch: cache → Nest HTTP.
   * When cache hits, still return immediately; caller keeps SSE open (FASSE-004).
   */
  loadList(pilotId: number): Observable<ProcessedBlueprint[]> {
    const cached = this.readCache(pilotId);
    if (cached) {
      return of(cached);
    }
    const url = `${environment.apiBaseUrl}/v1/pilots/${pilotId}/manufacture/blueprints`;
    return new Observable<ProcessedBlueprint[]>((sub) => {
      const httpSub = this.http.get<BlueprintDto[]>(url).subscribe({
        next: (dtos) => {
          const nodes = dtos.map(dtoToNode);
          this.writeCache(pilotId, nodes);
          sub.next(nodes);
          sub.complete();
        },
        error: (err) => sub.error(err),
      });
      return () => httpSub.unsubscribe();
    });
  }

  openEnrichment(pilotId: number): Observable<{ nodeId: string; node: BlueprintDto }> {
    const base = environment.sseBasePath || `${environment.apiBaseUrl}/v1`;
    const url = `${base}/pilots/${pilotId}/manufacture/blueprints/events`;
    return new Observable((subscriber) => {
      const sub = this.sse.open(url).subscribe({
        next: (evt) => {
          if (evt.type !== 'node-updated' && evt.type !== 'message') {
            return;
          }
          try {
            const payload = JSON.parse(evt.data) as { nodeId: string; node: BlueprintDto };
            this.mergeIntoCache(pilotId, payload.node);
            subscriber.next(payload);
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

  mergeIntoCache(pilotId: number, dto: BlueprintDto): ProcessedBlueprint[] {
    const current = this.readCache(pilotId) ?? [];
    const next = [...current];
    const idx = next.findIndex((n) => n.getBlueprintId() === dto.blueprintId);
    const node = dtoToNode(dto);
    if (idx >= 0) {
      next[idx] = node;
    } else {
      next.push(node);
    }
    this.writeCache(pilotId, next);
    return next;
  }
}

function dtoToNode(dto: BlueprintDto): ProcessedBlueprint {
  return new ProcessedBlueprint({
    blueprintId: dto.blueprintId,
    name: dto.name,
    ready: dto.ready,
    manufactureIndex: dto.manufactureIndex,
  });
}

function nodeToDto(node: ProcessedBlueprint): BlueprintDto {
  return {
    jsonClass: node.getJsonClass(),
    blueprintId: node.getBlueprintId(),
    name: node.getName(),
    ready: node.isReady(),
    manufactureIndex: node.getManufactureIndex(),
  };
}

function cloneBlueprint(node: ProcessedBlueprint): ProcessedBlueprint {
  return new ProcessedBlueprint({
    blueprintId: node.getBlueprintId(),
    name: node.getName(),
    ready: node.isReady(),
    manufactureIndex: node.getManufactureIndex(),
  });
}
