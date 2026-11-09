import { NeoCom } from '../NeoCom';

/** Nested priced item on an asset wire (programme `PricedItemV1Dto`). */
export type EveAssetItemWire = {
  jsonClass?: string;
  typeId?: number;
  name?: string;
  groupName?: string;
  categoryName?: string;
  volume?: number;
  buyPrice?: number;
  sellPrice?: number;
  /** Infinity legacy field — maps to sell when present. */
  baseprice?: number;
  iconUrl?: string;
};

/** Wire shape for `EveAssetV1Dto` / leaf asset (EPIC-015 §04). */
export type EveAssetV1DtoWire = {
  jsonClass?: string;
  itemId?: number;
  typeId?: number;
  quantity?: number;
  locationId?: number;
  locationType?: string;
  locationFlag?: string;
  isSingleton?: boolean;
  isBlueprintCopy?: boolean;
  name?: string;
  ownerPilotId?: number;
  category?: string;
  groupName?: string;
  item?: EveAssetItemWire;
};

/**
 * Canonical front NeoCom for a pilot asset leaf.
 * jsonClass `EveAssetV1` (= render registration). Source layout: infinity `neocom-asset`.
 */
export class EveAssetV1Node extends NeoCom {
  itemId: number;
  typeId: number;
  quantity: number;
  locationId: number;
  locationType: string;
  locationFlag: string;
  isSingleton: boolean;
  isBlueprintCopy: boolean | undefined;
  name: string;
  ownerPilotId: number;
  categoryName: string;
  groupName: string;
  itemName: string;
  volume: number;
  unitPrice: number;
  iconUrl: string;

  constructor(values: EveAssetV1DtoWire | object = {}) {
    super();
    this.jsonClass = 'EveAssetV1';
    const v = values as EveAssetV1DtoWire;
    const item = v.item ?? {};
    this.itemId = v.itemId ?? 0;
    this.typeId = v.typeId ?? item.typeId ?? 0;
    this.quantity = v.quantity ?? 0;
    this.locationId = v.locationId ?? 0;
    this.locationType = v.locationType ?? '';
    this.locationFlag = v.locationFlag ?? '';
    this.isSingleton = v.isSingleton ?? false;
    this.isBlueprintCopy = v.isBlueprintCopy;
    this.ownerPilotId = v.ownerPilotId ?? 0;
    this.itemName = item.name ?? '';
    this.name = v.name ?? (this.itemName || '-');
    this.categoryName = item.categoryName ?? v.category ?? '';
    this.groupName = item.groupName ?? v.groupName ?? '';
    this.volume = item.volume ?? 0;
    // ITEM VALUE = priced-item hub sell (unit); TOTAL VALUE = this × quantity.
    this.unitPrice = item.sellPrice ?? item.baseprice ?? item.buyPrice ?? 0;
    this.iconUrl = item.iconUrl ?? '';
  }

  static fromDto(dto: EveAssetV1DtoWire): EveAssetV1Node {
    return new EveAssetV1Node(dto);
  }

  getId(): number {
    return this.itemId;
  }

  getName(): string {
    return this.name || this.itemName || '-';
  }

  getTypeId(): number {
    return this.typeId;
  }

  getItemId(): number {
    return this.itemId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getCategoryName(): string {
    return this.categoryName;
  }

  getGroupName(): string {
    return this.groupName;
  }

  /** ITEM VALUE — unit price from nested priced item (`sellPrice`). */
  getItemValue(): number {
    return this.unitPrice;
  }

  /** TOTAL VALUE — priced-item unit × stack `quantity`. */
  getTotalValue(): number {
    return this.getItemValue() * this.quantity;
  }

  /** VOLUME — item unit volume × stack `quantity`. */
  getTotalVolume(): number {
    return this.volume * this.quantity;
  }

  getIconUrl(): string {
    return this.iconUrl;
  }

  override isExpandable(): boolean {
    return false;
  }
}
