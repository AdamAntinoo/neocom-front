import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlueprintV1Node } from '../../innovative-core/domain/nodes/blueprint-v1.node';
import { lookupRender } from '../render-registry';
import { V1BlueprintRenderComponent } from './v1-blueprint-render.component';

describe('V1BlueprintRenderComponent (DOM-BP-003)', () => {
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

  it('renders base identity card for BlueprintV1Node', () => {
    fixture.componentInstance.node = new BlueprintV1Node({
      blueprintId: 42,
      blueprintTypeId: 31717,
      blueprintTypeName: 'Small EM Shield Reinforcer I Blueprint',
      outputTypeId: 31716,
      outputTypeName: 'Small EM Shield Reinforcer I',
      runs: 300,
      materialEfficiency: 10,
      timeEfficiency: 20,
    });
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-render="v1-blueprint"]')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="blueprint-name"]')?.textContent).toContain(
      'Small EM Shield Reinforcer I Blueprint',
    );
    expect(root.querySelector('[cy-field-value="output-type-name"]')?.textContent).toContain(
      'Small EM Shield Reinforcer I',
    );
    expect(root.querySelector('[cy-field-value="material-efficiency"]')?.textContent).toContain(
      'ME 10',
    );
    expect(root.querySelector('[cy-field-value="time-efficiency"]')?.textContent).toContain('TE 20');
  });
});
