import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, shareReplay, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type {
  PilotUniverseIds,
  PilotUniverseResolved,
  UniverseAncestry,
  UniverseBloodline,
  UniverseCategorySummary,
  UniverseFaction,
  UniverseGraphicId,
  UniverseGroupSummary,
} from './universe-esi.types';

type CacheBucket =
  | 'ancestries'
  | 'bloodlines'
  | 'factions'
  | 'graphics'
  | 'groups'
  | 'categories'
  | `group:${number}`
  | `category:${number}`;

/**
 * Front adapter for unauthenticated ESI Universe reference data (UNIV-001…003).
 * Reads through `environment.esiBaseUrl` with no Authorization header; caches on the client.
 */
@Injectable({ providedIn: 'root' })
export class UniverseEsiAdapterService {
  private readonly http = inject(HttpClient);
  private readonly memory = new Map<CacheBucket, unknown>();
  private readonly inflight = new Map<CacheBucket, Observable<unknown>>();
  private readonly storagePrefix = 'neocom.universe.';

  /** GET /universe/ancestries/ — no access token. */
  getAncestries(): Observable<UniverseAncestry[]> {
    return this.cachedGet('ancestries', '/universe/ancestries/');
  }

  /** GET /universe/bloodlines/ — no access token. */
  getBloodlines(): Observable<UniverseBloodline[]> {
    return this.cachedGet('bloodlines', '/universe/bloodlines/');
  }

  /** GET /universe/factions/ — no access token. */
  getFactions(): Observable<UniverseFaction[]> {
    return this.cachedGet('factions', '/universe/factions/');
  }

  /** GET /universe/graphics/ — no access token. */
  getGraphics(): Observable<UniverseGraphicId[]> {
    return this.cachedGet('graphics', '/universe/graphics/');
  }

  /** GET /universe/groups/ — no access token. */
  getGroups(): Observable<number[]> {
    return this.cachedGet('groups', '/universe/groups/');
  }

  /** GET /universe/groups/{group_id}/ — no access token. */
  getGroup(groupId: number): Observable<UniverseGroupSummary> {
    return this.cachedGet(`group:${groupId}`, `/universe/groups/${groupId}/`);
  }

  /** GET /universe/categories/ — no access token. */
  getCategories(): Observable<number[]> {
    return this.cachedGet('categories', '/universe/categories/');
  }

  /** GET /universe/categories/{category_id}/ — no access token. */
  getCategory(categoryId: number): Observable<UniverseCategorySummary> {
    return this.cachedGet(`category:${categoryId}`, `/universe/categories/${categoryId}/`);
  }

  /**
   * Resolve Pilot character ids from Universe lists (ancestry, bloodline, faction).
   * Uses client-cached list downloads; never sends an access token (UNIV-001 / UNIV-002).
   */
  resolvePilotUniverse(ids: PilotUniverseIds): Observable<PilotUniverseResolved> {
    const ancestryId = ids.ancestryId;
    const bloodlineId = ids.bloodlineId;
    const factionId = ids.factionId;

    return forkJoin({
      ancestries:
        ancestryId != null && ancestryId > 0 ? this.getAncestries() : of([] as UniverseAncestry[]),
      bloodlines:
        bloodlineId != null && bloodlineId > 0
          ? this.getBloodlines()
          : of([] as UniverseBloodline[]),
      factions:
        factionId != null && factionId > 0 ? this.getFactions() : of([] as UniverseFaction[]),
    }).pipe(
      map(({ ancestries, bloodlines, factions }) => ({
        ancestry: ancestryId != null ? ancestries.find((a) => a.id === ancestryId) : undefined,
        bloodline:
          bloodlineId != null ? bloodlines.find((b) => b.bloodline_id === bloodlineId) : undefined,
        faction: factionId != null ? factions.find((f) => f.faction_id === factionId) : undefined,
      })),
    );
  }

  private cachedGet<T>(bucket: CacheBucket, path: string): Observable<T> {
    const fromMemory = this.memory.get(bucket) as T | undefined;
    if (fromMemory !== undefined) {
      return of(fromMemory);
    }
    const fromStorage = this.readStorage<T>(bucket);
    if (fromStorage !== undefined) {
      this.memory.set(bucket, fromStorage);
      return of(fromStorage);
    }

    let stream = this.inflight.get(bucket) as Observable<T> | undefined;
    if (stream) {
      return stream;
    }

    const url = `${environment.esiBaseUrl}${path}`;
    stream = this.http.get<T>(url).pipe(
      tap((payload) => {
        this.memory.set(bucket, payload);
        this.writeStorage(bucket, payload);
        this.inflight.delete(bucket);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.inflight.set(bucket, stream);
    return stream;
  }

  private readStorage<T>(bucket: CacheBucket): T | undefined {
    try {
      const raw = localStorage.getItem(this.storagePrefix + bucket);
      if (!raw) {
        return undefined;
      }
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  private writeStorage(bucket: CacheBucket, payload: unknown): void {
    try {
      localStorage.setItem(this.storagePrefix + bucket, JSON.stringify(payload));
    } catch {
      /* quota / private mode */
    }
  }
}
