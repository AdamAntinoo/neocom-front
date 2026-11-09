import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { PilotV2Node } from '../../innovative-core/domain/nodes/pilot-v2.node';
import { PublicPilotV1Node } from '../../innovative-core/domain/nodes/public-pilot-v1.node';
import { PilotService } from '../../services/pilot.service';
import { SessionService } from '../../../security/session.service';
import { V1PilotPanelComponent } from './v1-pilot-panel.component';

const pericoTuerto = new PublicPilotV1Node({
  jsonClass: 'PublicPilotV1',
  pilotId: 93813310,
  name: 'Perico Tuerto',
  birthday: '2013-09-09T19:40:09Z',
  gender: 'male',
  securityStatus: 0,
  corporation: { corporationId: 1000077, name: 'Corp', ticker: 'CRP', alliance: { name: 'Ally' } },
  raceData: { name: 'Caldari' },
  bloodlineData: { name: 'Deteis' },
  ancestryData: { name: 'Merchandisers' },
});

const authenticated = new PilotV2Node({
  jsonClass: 'PilotV2',
  pilotId: 93813310,
  name: 'Perico Tuerto',
  birthday: '2013-09-09T19:40:09Z',
  gender: 'male',
  raceData: { name: 'Caldari' },
  bloodlineData: { name: 'Deteis' },
  ancestryData: { name: 'Merchandisers' },
  totalSkillpoints: 8404419,
  walletBalance: 2_770_000_000,
  currentShipName: "Zach Zender's Velator",
});

describe('V1PilotPanelComponent', () => {
  async function setup(
    node: PublicPilotV1Node | PilotV2Node,
    options: { token?: string; variant?: 'auto' | 'public' | 'private' | 'list'; active?: boolean } = {},
  ): Promise<ComponentFixture<V1PilotPanelComponent>> {
    await TestBed.configureTestingModule({
      imports: [V1PilotPanelComponent],
      providers: [
        {
          provide: PilotService,
          useValue: { getPilot: () => of(node) },
        },
        {
          provide: SessionService,
          useValue: {
            getAccess: () =>
              options.token
                ? { accessToken: options.token, characterId: 93813310, characterName: 'Perico Tuerto' }
                : null,
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(V1PilotPanelComponent);
    if (options.variant !== undefined) {
      fixture.componentRef.setInput('variant', options.variant);
    }
    if (options.active !== undefined) {
      fixture.componentRef.setInput('active', options.active);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('should create a panel for the default pilot (PANEL-001, PANEL-010)', async () => {
    const fixture = await setup(pericoTuerto);
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.identifier()).toBe(93813310);
    const root = fixture.nativeElement.querySelector('[cy-element-name="pilot"][cy-element-type="panel"]');
    expect(root).toBeTruthy();
    expect(root.getAttribute('data-neocom-variant')).toBe(NeoComVariant.PILOT_PUBLIC);
  });

  it('should render public pilot with -PILOT-PUBLIC-VARIANT- (PANEL-006)', async () => {
    const fixture = await setup(pericoTuerto);
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-render="v1-public-pilot"]')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="pilotName"]')?.textContent).toBe('Perico Tuerto');
    expect(root.querySelector('[cy-field-value="pilotIdentifier"]')?.textContent).toContain('93813310');
    expect(root.querySelector('[cy-field-value="pilotAncestry"]')?.textContent).toBe(
      'Caldari - Merchandisers - Deteis',
    );
    expect(root.querySelector('[cy-field-value="pilotGender"]')?.textContent).toBe('MALE');
    expect(root.querySelector('[cy-field-value="totalSkillPoints"]')).toBeNull();
  });

  it('should hide private data when no credential is available (PANEL-003)', async () => {
    const fixture = await setup(authenticated, { variant: 'private' });
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-render="v1-public-pilot"]')).toBeTruthy();
    expect(root.querySelector('[cy-render="v2-pilot"]')).toBeNull();
    expect(root.querySelector('[cy-field-value="totalSkillPoints"]')).toBeNull();
  });

  it('should render authenticated pilot with -PILOT-VARIANT- when credential exists (PANEL-007)', async () => {
    const fixture = await setup(authenticated, { token: 'test-token', variant: 'private' });
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-neocom-variant]')?.getAttribute('data-neocom-variant')).toBe(
      NeoComVariant.PILOT,
    );
    expect(root.querySelector('[cy-render="v2-pilot"]')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="pilotName"]')?.textContent).toBe('Perico Tuerto');
    expect(root.querySelector('[cy-field-value="totalSkillPoints"]')?.textContent).toContain('8');
    expect(root.querySelector('[cy-field-value="pilotWalletBalance"]')?.textContent).toContain('B ISK');
    expect(root.querySelector('[cy-field-value="currentShip"]')?.textContent).toBe(
      "Zach Zender's Velator",
    );
  });

  it('should render list partial with greenish active background (PANEL-008, PANEL-009)', async () => {
    const fixture = await setup(pericoTuerto, { variant: 'list', active: true });
    const root = fixture.nativeElement as HTMLElement;
    const panel = root.querySelector('[cy-element-name="pilot"]') as HTMLElement;
    expect(panel.getAttribute('data-neocom-variant')).toBe(NeoComVariant.PILOT_LIST);
    expect(panel.classList.contains('pilot-list-active')).toBe(true);
    expect(root.querySelector('[cy-field-label="pilotName"]')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="pilotName"]')?.textContent).toBe('Perico Tuerto');
    expect(root.querySelector('[cy-field-value="pilotIdentifier"]')?.textContent).toBe('93813310');
    expect(root.querySelector('[cy-field-value="pilotAncestry"]')).toBeNull();
  });
});
