import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlueprintV1Node } from '../../innovative-core/domain/nodes/blueprint-v1.node';
import { lookupRender } from '../render-registry';
import { V1BlueprintRenderComponent } from './v1-blueprint-render.component';

describe('V1BlueprintRenderComponent (EPIC-010 §08 / DOM-BP-003)', () => {
  let fixture: ComponentFixture<V1BlueprintRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1BlueprintRenderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(V1BlueprintRenderComponent);
  });

  it('registers BlueprintV1 to v1-blueprint-render', () => {
    expect(lookupRender('BlueprintV1')).toBe(V1BlueprintRenderComponent);
  });

  it('renders base identity for a blueprint copy', () => {
    fixture.componentInstance.node = new BlueprintV1Node({
      blueprintId: 42,
      blueprintTypeId: 31717,
      blueprintTypeName: 'Small EM Shield Reinforcer I Blueprint',
      outputTypeId: 31716,
      outputTypeName: 'Small EM Shield Reinforcer I',
      runs: 300,
      materialEfficiency: 10,
      timeEfficiency: 20,
      maxRuns: 300,
    });
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-render="v1-blueprint"]')).toBeTruthy();
    expect(root.querySelector('[cy-field-label="blueprint-name"]')?.textContent).toContain(
      'BLUEPRINT NAME',
    );
    expect(root.querySelector('[cy-field-value="blueprint-name"]')?.textContent).toContain(
      'Small EM Shield Reinforcer I Blueprint',
    );
    expect(root.querySelector('[cy-field-value="efficiency"]')?.textContent).toContain('10/20');
    expect(root.querySelector('[cy-field-value="runs"]')?.textContent).toContain('300/300');
  });

  it('omits runs/maxRuns for a master (original) blueprint', () => {
    fixture.componentInstance.node = new BlueprintV1Node({
      blueprintTypeName: 'Master Sample Blueprint',
      runs: -1,
      materialEfficiency: 10,
      timeEfficiency: 20,
      maxRuns: 0,
    });
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-field-value="efficiency"]')?.textContent).toContain('10/20');
    expect(root.querySelector('[cy-field-value="runs"]')).toBeNull();
  });
});
