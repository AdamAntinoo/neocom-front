import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UniverseEsiAdapterService } from './universe-esi.adapter.service';
import type {
  PilotUniverseResolved,
  UniverseAncestry,
  UniverseBloodline,
} from './universe-esi.types';

describe('UniverseEsiAdapterService', () => {
  let service: UniverseEsiAdapterService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UniverseEsiAdapterService],
    });
    service = TestBed.inject(UniverseEsiAdapterService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('downloads ancestries without an Authorization header (UNIV-001)', () => {
    const received: UniverseAncestry[][] = [];
    service.getAncestries().subscribe((rows) => received.push(rows));

    const request = http.expectOne('/esi/v1/universe/ancestries/');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([
      {
        id: 11,
        name: 'Merchandisers',
        bloodline_id: 1,
        description: 'Trade-focused',
      },
    ]);

    expect(received[0][0].name).toBe('Merchandisers');
  });

  it('serves a second ancestries read from the client cache (UNIV-003)', () => {
    service.getAncestries().subscribe();
    http
      .expectOne('/esi/v1/universe/ancestries/')
      .flush([{ id: 11, name: 'Merchandisers', bloodline_id: 1, description: 'Trade-focused' }]);

    const second: UniverseAncestry[][] = [];
    service.getAncestries().subscribe((rows) => second.push(rows));
    http.expectNone('/esi/v1/universe/ancestries/');
    expect(second[0][0].id).toBe(11);
  });

  it('resolves Pilot bloodline and ancestry ids from Universe lists (UNIV-002)', () => {
    const resolved: PilotUniverseResolved[] = [];
    service.resolvePilotUniverse({ ancestryId: 11, bloodlineId: 1 }).subscribe((row) => {
      resolved.push(row);
    });

    http
      .expectOne('/esi/v1/universe/ancestries/')
      .flush([{ id: 11, name: 'Merchandisers', bloodline_id: 1, description: 'Trade-focused' }]);
    http.expectOne('/esi/v1/universe/bloodlines/').flush([
      {
        bloodline_id: 1,
        name: 'Deteis',
        race_id: 1,
        description: 'Caldari',
        corporation_id: 1,
        ship_type_id: null,
        charisma: 3,
        intelligence: 6,
        memory: 7,
        perception: 7,
        willpower: 5,
      } satisfies UniverseBloodline,
    ]);

    expect(resolved[0].ancestry?.name).toBe('Merchandisers');
    expect(resolved[0].bloodline?.name).toBe('Deteis');
  });

  it('calls the eight UNIV-002 Universe operations under esiBaseUrl', () => {
    service.getAncestries().subscribe();
    service.getBloodlines().subscribe();
    service.getFactions().subscribe();
    service.getGraphics().subscribe();
    service.getGroups().subscribe();
    service.getGroup(6).subscribe();
    service.getCategories().subscribe();
    service.getCategory(6).subscribe();

    http.expectOne('/esi/v1/universe/ancestries/').flush([]);
    http.expectOne('/esi/v1/universe/bloodlines/').flush([]);
    http.expectOne('/esi/v1/universe/factions/').flush([]);
    http.expectOne('/esi/v1/universe/graphics/').flush([]);
    http.expectOne('/esi/v1/universe/groups/').flush([6]);
    http.expectOne('/esi/v1/universe/groups/6/').flush({
      group_id: 6,
      name: 'Solar System',
      category_id: 2,
      published: true,
      types: [],
    });
    http.expectOne('/esi/v1/universe/categories/').flush([6]);
    http.expectOne('/esi/v1/universe/categories/6/').flush({
      category_id: 6,
      name: 'Ship',
      published: true,
      groups: [],
    });
  });
});
