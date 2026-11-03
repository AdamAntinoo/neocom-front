import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PublicPilotV1Node } from '../../modules/innovative-core/domain/nodes/public-pilot-v1.node';
import { PilotService } from '../../modules/services/pilot.service';
import { PublicCorporationService } from '../../modules/services/public-corporation.service';
import { PublicCorporationV1Node } from '../../modules/innovative-core/domain/nodes/public-corporation-v1.node';
import { DashboardHomePageComponent } from './dashboard-home-page.component';

const fixturePilot = new PublicPilotV1Node({
  jsonClass: 'PublicPilotV1',
  pilotId: 93813310,
  name: 'Perico Tuerto',
  corporation: { corporationId: 98477920, name: 'Industrial Freeholders' },
});

describe('DashboardHomePageComponent', () => {
  let component: DashboardHomePageComponent;
  let fixture: ComponentFixture<DashboardHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomePageComponent],
      providers: [
        provideRouter([]),
        {
          provide: PilotService,
          useValue: { getPilot: () => of(fixturePilot) },
        },
        {
          provide: PublicCorporationService,
          useValue: {
            getPublicCorporation: () =>
              of(
                PublicCorporationV1Node.from({
                  corporationId: 98477920,
                  name: 'Industrial Freeholders',
                  ticker: 'INDFH',
                }),
              ),
          },
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

  it('should render header, pilot & corporation, breadcrumb, and feature list', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-section-name="header"]')).toBeTruthy();
    expect(root.querySelector('#appinfo-panel')).toBeTruthy();
    expect(root.querySelector('#server-info-panel')).toBeTruthy();
    expect(root.querySelector('[cy-section-name="pilot-dashboard"]')).toBeTruthy();
    expect(root.querySelector('v1-pilot-panel')).toBeTruthy();
    expect(root.querySelector('v1-corporation-panel')).toBeTruthy();
    expect(root.querySelector('[cy-section-name="breadcrumb"]')).toBeTruthy();
    expect(root.querySelector('[cy-section-name="feature-list"]')).toBeTruthy();
  });
});
