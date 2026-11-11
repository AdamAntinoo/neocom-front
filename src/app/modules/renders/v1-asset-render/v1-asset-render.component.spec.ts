import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EveAssetV1Node } from '../../innovative-core/domain/nodes/eve-asset-v1.node';
import { lookupRender } from '../render-registry';
import { V1AssetRenderComponent } from './v1-asset-render.component';

describe('V1AssetRenderComponent', () => {
  let fixture: ComponentFixture<V1AssetRenderComponent>;

  beforeEach(async () => {
    V1AssetRenderComponent.registered = false;
    V1AssetRenderComponent.ensureRegistered();
    await TestBed.configureTestingModule({
      imports: [V1AssetRenderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(V1AssetRenderComponent);
    fixture.componentInstance.node = new EveAssetV1Node({
      itemId: 11,
      typeId: 34,
      quantity: 3,
      locationId: 60008494,
      name: 'Tritanium',
      item: {
        typeId: 34,
        name: 'Tritanium',
        groupName: 'Mineral',
        categoryName: 'Material',
        volume: 0.01,
        sellPrice: 5.5,
      },
    });
  });

  it('registers EveAssetV1 and LocatedAssetContainerV1', () => {
    expect(lookupRender('EveAssetV1')).toBe(V1AssetRenderComponent);
    expect(lookupRender('LocatedAssetContainerV1')).toBe(V1AssetRenderComponent);
  });

  it('exposes name, taxonomy, quantity, and value labels', () => {
    fixture.detectChanges();
    const c = fixture.componentInstance;
    expect(c.getName()).toBe('Tritanium');
    expect(c.getItemIdLabel()).toBe('11');
    expect(c.getTaxonomyLine()).toBe('Mineral / Material');
    expect(c.getQuantityLabel()).toBe('3');
    expect(c.getItemValueLabel()).toContain('ISK');
    expect(c.getTotalValueLabel()).toContain('ISK');
    expect(c.getVolumeLabel()).toContain('M3');
    expect(c.getTypeIconUrl()).toContain('34');
  });
});
