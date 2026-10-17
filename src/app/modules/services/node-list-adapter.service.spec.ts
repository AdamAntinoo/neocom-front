import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NodeListAdapterService } from './node-list-adapter.service';
import { AuthenticatedSseClient } from './authenticated-sse.client';
import { ProcessedBlueprint } from '../industry/domain/processed-blueprint';

describe('NodeListAdapterService', () => {
  let adapter: NodeListAdapterService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        NodeListAdapterService,
        { provide: AuthenticatedSseClient, useValue: { open: () => of() } },
      ],
    });
    adapter = TestBed.inject(NodeListAdapterService);
  });

  it('returns cache on leave/return without waiting for Nest', () => {
    const nodes = [new ProcessedBlueprint({ blueprintId: 1, name: 'A', ready: true })];
    adapter.writeCache(10, nodes);
    const hit = adapter.readCache(10);
    expect(hit).toHaveLength(1);
    expect(hit?.[0].getName()).toBe('A');
  });

  it('merges SSE enrichment into cache in place', () => {
    adapter.writeCache(11, [
      new ProcessedBlueprint({ blueprintId: 5, name: 'X', ready: false, manufactureIndex: null }),
    ]);
    const next = adapter.mergeIntoCache(11, {
      blueprintId: 5,
      name: 'X',
      ready: true,
      manufactureIndex: 1.5,
    });
    expect(next[0].isReady()).toBe(true);
    expect(next[0].getManufactureIndex()).toBe(1.5);
  });
});
