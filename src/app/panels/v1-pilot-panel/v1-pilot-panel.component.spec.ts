import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1PilotPanelComponent } from './v1-pilot-panel.component';

describe('V1PilotPanelComponent', () => {
  let fixture: ComponentFixture<V1PilotPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1PilotPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1PilotPanelComponent);
    fixture.detectChanges();
  });

  it('should create an empty catalogued panel', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[cy-section-name="pilot"]')).toBeTruthy();
  });
});
