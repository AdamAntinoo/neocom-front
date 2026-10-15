import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PilotService } from './pilot.service';
import type { PilotV1 } from './pilot-v1';

describe('PilotService', () => {
  let service: PilotService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), PilotService],
    });
    service = TestBed.inject(PilotService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('requests the pilot from neocom-back', () => {
    const received: PilotV1[] = [];
    service.getPilot(93813310).subscribe((pilot) => received.push(pilot));

    const request = http.expectOne('/v1/pilots/93813310');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ pilotId: 93813310, name: 'Perico Tuerto' });

    expect(received).toEqual([{ pilotId: 93813310, name: 'Perico Tuerto' }]);
  });

  it('sends Authorization when the caller is logged in', () => {
    service.getPilot(93813310, 'present').subscribe();

    const request = http.expectOne('/v1/pilots/93813310');
    expect(request.request.headers.get('Authorization')).toBe('present');
    request.flush({ pilotId: 93813310, name: 'Perico Tuerto', walletBalance: 34 });
  });
});
