import { EveAssetV1Node, type EveAssetV1DtoWire } from './eve-asset-v1.node';
import type { NeoCom } from '../NeoCom';

/** Wire shape for `LocatedAssetContainerV1Dto` (asset + contents). */
export type LocatedAssetContainerV1DtoWire = EveAssetV1DtoWire & {
  contents?: unknown[];
};

/**
 * Expandable asset container. jsonClass `LocatedAssetContainerV1`.
 * Children come from wire `contents` (FAL-026…028, FAL-032).
 */
export class LocatedAssetContainerV1Node extends EveAssetV1Node {
  constructor(values: LocatedAssetContainerV1DtoWire | object = {}) {
    super(values);
    this.jsonClass = 'LocatedAssetContainerV1';
  }

  static fromContainerDto(dto: LocatedAssetContainerV1DtoWire): LocatedAssetContainerV1Node {
    return new LocatedAssetContainerV1Node(dto);
  }

  /** Attach mapped content children (NeoCom assets / nested containers). */
  setContents(children: NeoCom[]): void {
    this.children.length = 0;
    for (const child of children) {
      this.addChild(child);
    }
  }

  override isExpandable(): boolean {
    return this.getChildren().length > 0;
  }
}
