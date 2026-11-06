import type { ICollaboration } from './ICollaboration.interface';
import type { ISelectable } from './ISelectable.interface';

export interface IViewer {
  getVariant(): string;
  getNodes2Render(): ICollaboration[];
  isDownloading(): boolean;
  notifyDataChanged(): void;
  updateSelection(node: ISelectable): void;
  enterSelected(node: ICollaboration): void;
}
