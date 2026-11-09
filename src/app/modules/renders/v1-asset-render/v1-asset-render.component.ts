import { Component, Input, OnInit } from '@angular/core';
import { NeoCom } from '../../innovative-core/domain/NeoCom';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { EveAssetV1Node } from '../../innovative-core/domain/nodes/eve-asset-v1.node';
import { LocatedAssetContainerV1Node } from '../../innovative-core/domain/nodes/located-asset-container-v1.node';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { typeIconUrl } from '../../shared/eve-image-server';
import { registerRender } from '../render-registry';

/**
 * Base asset leaf / container card — jsonClass `EveAssetV1` / `LocatedAssetContainerV1`.
 * Layout source: neocom-infinity `Neocom.WebUI` `neocom-asset` (`asset.component.html`).
 * Short name: **v1-asset**.
 */
@Component({
  selector: 'v1-asset-render',
  templateUrl: './v1-asset-render.component.html',
  styleUrl: './v1-asset-render.component.scss',
})
export class V1AssetRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: NeoCom;
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;
  /** Bound by `v2-node-container` via NgComponentOutlet (unused here). */
  @Input() index = 1;
  @Input() selectOnHover = false;

  static registered = false;

  static ensureRegistered(): void {
    if (V1AssetRenderComponent.registered) {
      return;
    }
    registerRender('EveAssetV1', V1AssetRenderComponent);
    registerRender('LocatedAssetContainerV1', V1AssetRenderComponent);
    V1AssetRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1AssetRenderComponent.ensureRegistered();
  }

  getAsset(): EveAssetV1Node | undefined {
    if (this.node instanceof EveAssetV1Node || this.node instanceof LocatedAssetContainerV1Node) {
      return this.node;
    }
    return undefined;
  }

  getName(): string {
    return this.getAsset()?.getName() ?? '-';
  }

  getItemIdLabel(): string {
    const id = this.getAsset()?.getItemId();
    return id == null ? '-' : String(id);
  }

  /** Second line: group then category. */
  getTaxonomyLine(): string {
    const asset = this.getAsset();
    if (!asset) {
      return '';
    }
    const group = asset.getGroupName();
    const category = asset.getCategoryName();
    if (group && category) {
      return `${group} / ${category}`;
    }
    return group || category || '';
  }

  getTypeIconUrl(): string {
    const asset = this.getAsset();
    if (!asset) {
      return '';
    }
    // Standard `neo-icon-xl` (64) — adequate for asset type tiles.
    return asset.getIconUrl() || typeIconUrl(asset.getTypeId(), 64);
  }

  /** ITEM VALUE — nested priced-item unit (`sellPrice`). */
  getItemValueLabel(): string {
    const price = this.getAsset()?.getItemValue();
    if (price == null) {
      return '…';
    }
    return `${formatIsk(price, 2)} ISK`;
  }

  /** TOTAL VALUE — item value × stack quantity. */
  getTotalValueLabel(): string {
    const total = this.getAsset()?.getTotalValue();
    if (total == null) {
      return '…';
    }
    return `${formatIsk(total, 0)} ISK`;
  }

  getQuantityLabel(): string {
    const qty = this.getAsset()?.getQuantity();
    if (qty == null) {
      return '…';
    }
    return formatIsk(qty, 0);
  }

  /** VOLUME — item.volume × stack quantity. */
  getVolumeLabel(): string {
    const volume = this.getAsset()?.getTotalVolume();
    if (volume == null) {
      return '…';
    }
    return `${formatIsk(volume, 0)} M3`;
  }
}

function formatIsk(value: number, fractionDigits: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

V1AssetRenderComponent.ensureRegistered();
