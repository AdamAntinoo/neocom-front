import type { ISelectable } from './interfaces/ISelectable.interface';

export class SingleSelectionManager {
  private selection: ISelectable[] = [];

  updateSelection(node: ISelectable): void {
    if (node.isSelected()) {
      for (const prior of this.selection) {
        if (prior !== node) {
          prior.unselect();
        }
      }
      this.selection = [node];
    } else {
      this.selection = this.selection.filter((n) => n !== node);
    }
  }

  getSelection(): ISelectable[] {
    return [...this.selection];
  }
}
