import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { ApplicationInfoV1Node } from '../../innovative-core/domain/nodes/application-info-v1.node';
import { ServerStatusV1Node } from '../../innovative-core/domain/nodes/server-status-v1.node';
import { ApplicationInfoProvider } from '../providers/application-info.provider';
import { ServerStatusProvider } from '../providers/server-status.provider';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [
        {
          provide: ApplicationInfoProvider,
          useValue: {
            getApplicationInfo: () =>
              new ApplicationInfoV1Node({
                name: 'neocom-front',
                version: '0.1.0',
                copyright: '© test',
              }),
          },
        },
        {
          provide: ServerStatusProvider,
          useValue: {
            getServerStatus: () =>
              of(
                new ServerStatusV1Node({
                  server: 'Tranquility',
                  players: 12,
                  backendVersion: '1',
                  SDEVersion: '2',
                  nextDowntime: 'soon',
                }),
              ),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
  });

  it('should provide ApplicationInfo and ServerStatus NeoCom nodes for NeoComVariant.APP', () => {
    fixture.componentInstance.variant = NeoComVariant.APP;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-section-name="header"]')).toBeTruthy();
    expect(root.querySelector('#appinfo-panel')).toBeTruthy();
    expect(root.querySelector('#server-info-panel')).toBeTruthy();
    expect(root.querySelector('v1-application-info-render')).toBeTruthy();
    expect(root.querySelector('v1-server-status-render')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="app-name"]')?.textContent?.trim()).toBe('NEOCOM-FRONT');
    expect(root.querySelector('[cy-field-value="server-name"]')?.textContent?.trim()).toBe('Tranquility');
  });

  it('should provide only ApplicationInfo for NeoComVariant.AUTH', () => {
    fixture.componentInstance.variant = NeoComVariant.AUTH;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('#appinfo-panel')).toBeTruthy();
    expect(root.querySelector('#server-info-panel')).toBeNull();
  });
});
