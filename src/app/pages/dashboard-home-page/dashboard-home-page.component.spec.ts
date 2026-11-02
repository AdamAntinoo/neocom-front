import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PublicPilotV1Node } from '../../modules/innovative-core/domain/nodes/public-pilot-v1.node';
import { PilotService } from '../../modules/services/pilot.service';
import { DashboardHomePageComponent } from './dashboard-home-page.component';

const fixturePilot = new PublicPilotV1Node({
  jsonClass: 'PublicPilotV1',
  pilotId: 93813310,
  name: 'Perico Tuerto',
});

describe('DashboardHomePageComponent', () => {
  let component: DashboardHomePageComponent;
  let fixture: ComponentFixture<DashboardHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomePageComponent],
      providers: [
        {
          provide: PilotService,
          useValue: { getPilot: () => of(fixturePilot) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the start page', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header panels and the pilot dashboard', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-section-name="header"]')).toBeTruthy();
    expect(root.querySelector('#appinfo-panel')).toBeTruthy();
    expect(root.querySelector('#server-info-panel')).toBeTruthy();
    expect(root.querySelector('[cy-section-name="pilot-dashboard"]')).toBeTruthy();
    expect(root.querySelector('v1-pilot-panel')).toBeTruthy();
  });
});
