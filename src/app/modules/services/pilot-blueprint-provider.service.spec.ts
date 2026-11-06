import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PilotBlueprintProviderService } from './pilot-blueprint-provider.service';

describe('PilotBlueprintProviderService', () => {
  let provider: PilotBlueprintProviderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    provider = TestBed.inject(PilotBlueprintProviderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads blueprints as NeoCom nodes via HTTP and caches by pilot (no SSE)', () => {
    let snap: unknown;
    provider.observeBlueprints(42).subscribe((n) => {
      snap = n;
    });

    const req = http.expectOne('/v1/pilots/42/blueprints');
    req.flush([
      {
        jsonClass: 'BlueprintV1Dto',
        blueprintId: 7,
        blueprintTypeName: 'Ishtar Blueprint',
        location: {
          regionId: 10000043,
          regionName: 'Domain',
          solarSystemId: 30002187,
          solarSystemName: 'Amarr',
        },
      },
    ]);

    const nodes = snap as ReturnType<PilotBlueprintProviderService['readCache']>;
    expect(nodes).toHaveLength(1);
    expect(nodes![0].getJsonClass()).toBe('BlueprintV1');
    expect(nodes![0].getSpaceLocation()?.getRegionName()).toBe('Domain');
    expect(provider.readCache(42)).toHaveLength(1);
    expect(provider.readCache(99)).toBeNull();
  });

  it('upserts by blueprint id without clearing another pilot cache', () => {
    provider.upsert(1, {
      blueprintId: 1,
      blueprintTypeName: 'A',
      location: { regionName: 'Domain', solarSystemName: 'Amarr' },
    });
    provider.upsert(2, {
      blueprintId: 2,
      blueprintTypeName: 'B',
      location: { regionName: 'The Forge', solarSystemName: 'Jita' },
    });
    provider.upsert(1, {
      blueprintId: 1,
      blueprintTypeName: 'A2',
      location: { regionName: 'Domain', solarSystemName: 'Amarr' },
    });

    expect(provider.readCache(1)![0].getName()).toBe('A2');
    expect(provider.readCache(2)![0].getName()).toBe('B');
  });
});
