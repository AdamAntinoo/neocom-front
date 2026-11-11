import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SpaceLocationService } from './space-location.service';

describe('SpaceLocationService', () => {
  let service: SpaceLocationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SpaceLocationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('returns null for non-positive location ids without HTTP', () => {
    let snap: unknown = 'unset';
    service.resolve(0).subscribe((n) => {
      snap = n;
    });
    expect(snap).toBeNull();
  });

  it('resolves a place from the universe spacelocations API and caches it', () => {
    let snap: unknown;
    service.resolve(60008494).subscribe((n) => {
      snap = n;
    });

    const req = http.expectOne('/api/v1/universe/spacelocations/60008494');
    req.flush({
      locationId: 60008494,
      regionName: 'Domain',
      solarSystemName: 'Amarr',
      regionId: 10000043,
      solarSystemId: 30002187,
    });

    expect(snap).toBeTruthy();
    expect((snap as { getRegionName(): string }).getRegionName()).toBe('Domain');

    let cached: unknown;
    service.resolve(60008494).subscribe((n) => {
      cached = n;
    });
    expect(cached).toBe(snap);
  });

  it('returns null when the backend errors', () => {
    let snap: unknown = 'unset';
    service.resolve(99).subscribe((n) => {
      snap = n;
    });
    http.expectOne('/api/v1/universe/spacelocations/99').flush('nope', {
      status: 404,
      statusText: 'Not Found',
    });
    expect(snap).toBeNull();
  });
});
