import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionV1Node } from '@domain';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { lookupRender } from '../render-registry';
import { V1RegionRenderComponent } from './v1-region-render.component';

describe('V1RegionRenderComponent', () => {
  let fixture: ComponentFixture<V1RegionRenderComponent>;

  beforeEach(async () => {
    V1RegionRenderComponent.registered = false;
    V1RegionRenderComponent.ensureRegistered();
    await TestBed.configureTestingModule({
      imports: [V1RegionRenderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(V1RegionRenderComponent);
    fixture.componentInstance.node = new RegionV1Node({ name: 'Domain' });
  });

  it('registers RegionV1 so the node container can resolve the card', () => {
    expect(lookupRender('RegionV1')).toBe(V1RegionRenderComponent);
  });

  it('paints the region card for the blueprint-by-location list variant', () => {
    fixture.componentInstance.variant = NeoComVariant.BLUEPRINT_LIST;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.region-card')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="regionName"]')?.textContent).toContain('Domain');
  });

  it('paints the region card for the lookup specimen variant', () => {
    fixture.componentInstance.variant = NeoComVariant.SOLAR_SYSTEM_LOOKUP;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.region-card')).toBeTruthy();
  });
});
