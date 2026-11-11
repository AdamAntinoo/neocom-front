import { Component, input, signal } from '@angular/core';
import { BackgroundEnabledComponent } from '../background-enabled/background-enabled.component';
import type { ICollaboration } from '../../domain/interfaces/ICollaboration.interface';
import type { ISelectable } from '../../domain/interfaces/ISelectable.interface';
import type { IViewer } from '../../domain/interfaces/IViewer.interface';
import { NeoComVariant } from '../../domain/NeoComVariant';
import { SingleSelectionManager } from '../../domain/SingleSelectionManager';

/**
 * Feature panels extend this: own dataModelRoot, render list, download flag, variant (NODE-006, NODE-015).
 * Download / render-list state is signal-backed so zoneless CD refreshes after async feeds.
 */
@Component({
  selector: 'app-panel',
  template: '',
})
export class AppPanelComponent extends BackgroundEnabledComponent implements IViewer {
  readonly variantInput = input<NeoComVariant | string>(NeoComVariant.DEFAULT, {
    alias: 'variant',
  });

  private readonly downloading = signal(true);
  protected dataModelRoot: ICollaboration[] = [];
  private readonly renderNodeList = signal<ICollaboration[]>([]);
  protected variant: NeoComVariant | string = NeoComVariant.DEFAULT;
  protected selectionManager = new SingleSelectionManager();

  getVariant(): string {
    return this.variant || this.variantInput();
  }

  setVariant(variant: NeoComVariant | string): void {
    this.variant = variant;
  }

  isDownloading(): boolean {
    return this.downloading();
  }

  getNodes2Render(): ICollaboration[] {
    return this.renderNodeList();
  }

  startDownloading(): void {
    this.downloading.set(true);
  }

  /** Spelling preserved from infinity (completeDowload). */
  completeDowload(nodes: ICollaboration[]): void {
    this.dataModelRoot = nodes;
    this.notifyDataChanged();
    this.downloading.set(false);
  }

  enterSelected(_node: ICollaboration): void {}

  updateSelection(node: ISelectable): void {
    this.selectionManager.updateSelection(node);
    this.fireSelectionChanged();
  }

  fireSelectionChanged(): void {}

  getSelection(): ISelectable[] {
    return this.selectionManager.getSelection();
  }

  notifyDataChanged(): void {
    const copyList: ICollaboration[] = [];
    for (const node of this.applyPolicies(this.dataModelRoot)) {
      const nodes = node.collaborate2View(this.getVariant());
      if (nodes != null) {
        copyList.push(...nodes);
      }
    }
    this.renderNodeList.set(copyList);
  }

  applyPolicies(entries: ICollaboration[]): ICollaboration[] {
    return entries;
  }
}
