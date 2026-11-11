import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, defer, of, finalize, map, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EveAssetV1Node,
  type EveAssetV1DtoWire,
} from '../innovative-core/domain/nodes/eve-asset-v1.node';
import {
  LocatedAssetContainerV1Node,
  type LocatedAssetContainerV1DtoWire,
} from '../innovative-core/domain/nodes/located-asset-container-v1.node';

const TTL_MS = 60 * 60 * 1000;

export type PilotAssetNode = EveAssetV1Node | LocatedAssetContainerV1Node;

type PilotCacheEntry = {
  nodes: PilotAssetNode[];
  expiresAt: number;
};

/**
 * Loads the complete pilot asset list (FAL-020, FAL-029).
 * `GET /v1/pilots/:id/assets`.
 */
@Injectable({ providedIn: 'root' })
export class PilotAssetProviderService {
  private readonly http = inject(HttpClient);
  private readonly memory = new Map<number, PilotCacheEntry>();
  private readonly streams = new Map<number, Observable<PilotAssetNode[]>>();

  observeAssets(pilotId: number): Observable<PilotAssetNode[]> {
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

  readCache(pilotId: number): PilotAssetNode[] | null {
    const entry = this.memory.get(pilotId);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.memory.delete(pilotId);
      return null;
    }
    return entry.nodes.map((n) => cloneAsset(n));
  }

  private ensureLoaded(pilotId: number): Observable<PilotAssetNode[]> {
    const cached = this.readCache(pilotId);
    if (cached) {
      return of(cached);
    }
    return this.fetchList(pilotId).pipe(tap((nodes) => this.writeCache(pilotId, nodes)));
  }

  private writeCache(pilotId: number, nodes: PilotAssetNode[]): void {
    this.memory.set(pilotId, {
      nodes: nodes.map((n) => cloneAsset(n)),
      expiresAt: Date.now() + TTL_MS,
    });
  }

  private fetchList(pilotId: number): Observable<PilotAssetNode[]> {
    const url = `${environment.apiBaseUrl}/v1/pilots/${pilotId}/assets`;
    return this.http.get<unknown[]>(url).pipe(
      map((dtos) => {
        if (!Array.isArray(dtos)) {
          throw new Error('Pilot assets response is not an array');
        }
        return dtos.map((d) => mapPilotAssetNode(d));
      }),
    );
  }
}

export function mapPilotAssetNode(raw: unknown): PilotAssetNode {
  const dto = (raw ?? {}) as LocatedAssetContainerV1DtoWire;
  const jsonClass = String(dto.jsonClass ?? '');
  if (
    jsonClass === 'LocatedAssetContainerV1Dto' ||
    jsonClass === 'LocatedAssetContainerV1' ||
    Array.isArray(dto.contents)
  ) {
    const container = LocatedAssetContainerV1Node.fromContainerDto(dto);
    const kids = (dto.contents ?? []).map((c) => mapPilotAssetNode(c));
    container.setContents(kids);
    return container;
  }
  return EveAssetV1Node.fromDto(dto as EveAssetV1DtoWire);
}

function cloneAsset(node: PilotAssetNode): PilotAssetNode {
  if (node instanceof LocatedAssetContainerV1Node) {
    const copy = LocatedAssetContainerV1Node.fromContainerDto({
      itemId: node.itemId,
      typeId: node.typeId,
      quantity: node.quantity,
      locationId: node.locationId,
      locationType: node.locationType,
      locationFlag: node.locationFlag,
      isSingleton: node.isSingleton,
      isBlueprintCopy: node.isBlueprintCopy,
      name: node.name,
      ownerPilotId: node.ownerPilotId,
      item: {
        typeId: node.typeId,
        name: node.itemName,
        categoryName: node.categoryName,
        groupName: node.groupName,
        volume: node.volume,
        sellPrice: node.getItemValue(),
        iconUrl: node.iconUrl,
      },
      contents: [],
    });
    copy.setContents(node.getChildren().map((c) => cloneAsset(c as PilotAssetNode)));
    return copy;
  }
  return EveAssetV1Node.fromDto({
    itemId: node.itemId,
    typeId: node.typeId,
    quantity: node.quantity,
    locationId: node.locationId,
    locationType: node.locationType,
    locationFlag: node.locationFlag,
    isSingleton: node.isSingleton,
    isBlueprintCopy: node.isBlueprintCopy,
    name: node.name,
    ownerPilotId: node.ownerPilotId,
    item: {
      typeId: node.typeId,
      name: node.itemName,
      categoryName: node.categoryName,
      groupName: node.groupName,
      volume: node.volume,
      sellPrice: node.getItemValue(),
      iconUrl: node.iconUrl,
    },
  });
}
