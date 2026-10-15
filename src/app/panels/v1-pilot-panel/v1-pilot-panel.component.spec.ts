import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PilotService } from '../../modules/services/pilot.service';
import type { PilotV1 } from '../../modules/services/pilot-v1';
import { V1PilotPanelComponent } from './v1-pilot-panel.component';

const pericoTuerto: PilotV1 = {
  pilotId: 93813310,
  name: 'Perico Tuerto',
  birthday: '2013-09-09T19:40:09Z',
  gender: 'male',
  securityStatus: 0,
  corporation: { corporationId: 1000077, name: 'Corp', ticker: 'CRP', alliance: { name: 'Ally' } },
  raceData: { name: 'Caldari' },
  bloodlineData: { name: 'Deteis' },
  ancestryData: { name: 'Merchandisers' },
};

describe('V1PilotPanelComponent', () => {
  let fixture: ComponentFixture<V1PilotPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1PilotPanelComponent],
      providers: [
        {
          provide: PilotService,
          useValue: { getPilot: () => of(pericoTuerto) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(V1PilotPanelComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create a panel for the default pilot', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.identifier()).toBe(93813310);
    expect(fixture.nativeElement.querySelector('[cy-section-name="pilot"]')).toBeTruthy();
  });

  it('should show the PilotV1Dto returned by the backend', () => {
    const text = (name: string) =>
      fixture.nativeElement.querySelector(`[cy-field-value="${name}"]`).textContent;
    expect(text('pilot-name')).toBe('Perico Tuerto');
    expect(text('pilot-id')).toBe('93813310');
    expect(text('pilot-corporation')).toContain('Corp');
    expect(text('pilot-race')).toBe('Caldari');
    expect(text('pilot-bloodline')).toBe('Deteis');
    expect(text('pilot-ancestry')).toBe('Merchandisers');
  });
});
