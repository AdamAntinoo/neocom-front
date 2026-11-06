import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolarSystemV1Node } from '@domain';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { lookupRender } from '../render-registry';
import { V1SystemRenderComponent } from './v1-system-render.component';

describe('V1SystemRenderComponent', () => {
  let fixture: ComponentFixture<V1SystemRenderComponent>;

  beforeEach(async () => {
    V1SystemRenderComponent.registered = false;
    V1SystemRenderComponent.ensureRegistered();
    await TestBed.configureTestingModule({
      imports: [V1SystemRenderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(V1SystemRenderComponent);
    fixture.componentInstance.node = new SolarSystemV1Node({ name: 'Amarr' });
  });

  it('registers SolarSystemV1 so the node container can resolve the card', () => {
    expect(lookupRender('SolarSystemV1')).toBe(V1SystemRenderComponent);
  });

  it('paints the system card for the blueprint-by-location list variant', () => {
    fixture.componentInstance.variant = NeoComVariant.BLUEPRINT_LIST;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.system-card')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="systemName"]')?.textContent).toContain('Amarr');
  });

  it('paints the system card for the lookup specimen variant', () => {
    fixture.componentInstance.variant = NeoComVariant.SOLAR_SYSTEM_LOOKUP;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.system-card')).toBeTruthy();
  });
});
