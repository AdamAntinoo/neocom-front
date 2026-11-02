import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PilotV2Node } from '../innovative-core/domain/nodes/pilot-v2.node';
import { PublicPilotV1Node } from '../innovative-core/domain/nodes/public-pilot-v1.node';
import { PilotService } from './pilot.service';

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

  it('requests the pilot from neocom-back and wraps PublicPilotV1Node', () => {
    const received: PublicPilotV1Node[] = [];
    service.getPilot(93813310).subscribe((pilot) => received.push(pilot as PublicPilotV1Node));

    const request = http.expectOne('/v1/pilots/93813310');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ jsonClass: 'PublicPilotV1', pilotId: 93813310, name: 'Perico Tuerto' });

    expect(received[0]).toBeInstanceOf(PublicPilotV1Node);
    expect(received[0].getPilotId()).toBe(93813310);
    expect(received[0].getName()).toBe('Perico Tuerto');
  });

  it('wraps PilotV2 when Authorization is present', () => {
    const received: PilotV2Node[] = [];
    service.getPilot(93813310, 'present').subscribe((pilot) => received.push(pilot as PilotV2Node));

    const request = http.expectOne('/v1/pilots/93813310');
    expect(request.request.headers.get('Authorization')).toBe('present');
    request.flush({
      jsonClass: 'PilotV2',
      pilotId: 93813310,
      name: 'Perico Tuerto',
      walletBalance: 34,
    });

    expect(received[0]).toBeInstanceOf(PilotV2Node);
    expect(received[0].getWalletBalance()).toBe(34);
  });
});
