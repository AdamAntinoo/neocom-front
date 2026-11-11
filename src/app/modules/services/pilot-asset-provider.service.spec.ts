import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PilotAssetProviderService } from './pilot-asset-provider.service';

describe('PilotAssetProviderService', () => {
  let provider: PilotAssetProviderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    provider = TestBed.inject(PilotAssetProviderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads assets as NeoCom nodes via HTTP and caches by pilot', () => {
    let snap: unknown;
    provider.observeAssets(42).subscribe((n) => {
      snap = n;
    });

    const req = http.expectOne('/v1/pilots/42/assets');
    req.flush([
      {
        jsonClass: 'EveAssetV1Dto',
        itemId: 7,
        typeId: 34,
        quantity: 2,
        locationId: 60008494,
        name: 'Tritanium',
        item: { typeId: 34, name: 'Tritanium', sellPrice: 5 },
      },
      {
        jsonClass: 'LocatedAssetContainerV1Dto',
        itemId: 8,
        typeId: 100,
        quantity: 1,
        locationId: 60008494,
        name: 'Hangar Container',
        contents: [
          {
            jsonClass: 'EveAssetV1Dto',
            itemId: 9,
            typeId: 35,
            quantity: 10,
            locationId: 8,
            name: 'Pyerite',
            item: { typeId: 35, name: 'Pyerite' },
          },
        ],
      },
    ]);

    const nodes = snap as NonNullable<ReturnType<PilotAssetProviderService['readCache']>>;
    expect(nodes).toHaveLength(2);
    expect(nodes[0].getJsonClass()).toBe('EveAssetV1');
    expect(nodes[1].getJsonClass()).toBe('LocatedAssetContainerV1');
    expect(nodes[1].getChildren()).toHaveLength(1);
    expect(provider.readCache(42)).toHaveLength(2);
    expect(provider.readCache(99)).toBeNull();
  });

  it('reuses the in-memory cache on a second observe without another HTTP call', () => {
    provider.observeAssets(7).subscribe();
    http.expectOne('/v1/pilots/7/assets').flush([
      {
        jsonClass: 'EveAssetV1Dto',
        itemId: 1,
        typeId: 1,
        quantity: 1,
        locationId: 1,
        name: 'A',
        item: { typeId: 1, name: 'A' },
      },
    ]);

    let second: unknown;
    provider.observeAssets(7).subscribe((n) => {
      second = n;
    });
    expect(second).toHaveLength(1);
  });
});
