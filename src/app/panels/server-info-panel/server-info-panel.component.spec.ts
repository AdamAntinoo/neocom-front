import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServerInfoPanelComponent } from './server-info-panel.component';

describe('ServerInfoPanelComponent', () => {
  let fixture: ComponentFixture<ServerInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerInfoPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServerInfoPanelComponent);
    fixture.detectChanges();
  });

  it('should show the server data placeholder', () => {
    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('[cy-section-name="server-info"]');
    expect(section).toBeTruthy();
    expect(section?.textContent).toContain('-SERVER-DATA-');
  });
});
