import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AppInfoPanelComponent } from './app-info-panel.component';

describe('AppInfoPanelComponent', () => {
  let fixture: ComponentFixture<AppInfoPanelComponent>;
  let component: AppInfoPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppInfoPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the panel', () => {
    expect(component).toBeTruthy();
  });

  it('should read the application name, version, and copyright', () => {
    expect(component.getName()).toBe(environment.appName.toUpperCase());
    expect(component.getVersion()).toBe(environment.appVersion);
    expect(component.getCopyright()).toBe(environment.copyright);
  });

  it('should catalog the name, version, and copyright', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-section-name="app-info"]')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="app-name"]')?.textContent).toBe(component.getName());
    expect(root.querySelector('[cy-field-value="app-version"]')?.textContent).toBe(component.getVersion());
    expect(root.querySelector('[cy-field-value="app-copyright"]')?.textContent).toBe(component.getCopyright());
  });
});
