import type { ICollaboration } from './interfaces/ICollaboration.interface';
import type { IExpandable } from './interfaces/IExpandable.interface';
import type { INode } from './interfaces/INode.interface';
import type { ISelectable } from './interfaces/ISelectable.interface';

/**
 * Front render/node base — model side of the node / Part / render MVC trio (NODE-001, NODE-014).
 * Lives only in neocom-front (not in neocom-domain).
 *
 * Published interchange models stay as `Record` + `jsonClass` in `neocom-domain`.
 * For the viewer / registry path, wrap them in NeoCom subclasses under `./nodes/`
 * (e.g. {@link BlueprintV1Node}) so collaborate2View / expand / select work.
 * Renders call node methods; they do not read raw wire Records past those methods.
 */
export class NeoCom implements INode, ICollaboration, IExpandable, ISelectable {
  public jsonClass = 'NeoCom';
  protected expanded = false;
  protected selected = false;
  protected visible = true;
  protected children: NeoCom[] = [];

  constructor(values: object = {}) {
    Object.assign(this, values);
  }

  getJsonClass(): string {
    return this.jsonClass;
  }

  isActive(): boolean {
    return true;
  }

  isVisible(): boolean {
    return this.visible;
  }

  setVisible(value: boolean): void {
    this.visible = value;
  }

  getChildren(): NeoCom[] {
    return this.children;
  }

  addChild(child: NeoCom): void {
    this.children.push(child);
  }

  /**
   * Invisible nodes contribute nothing. Collapsed → self only.
   * Expanded → self plus each visible child's collaboration.
   */
  collaborate2View(variant?: string): ICollaboration[] {
    if (!this.isVisible()) {
      return [];
    }
    const list: ICollaboration[] = [this];
    if (this.isExpanded()) {
      for (const child of this.children) {
        list.push(...child.collaborate2View(variant));
      }
    }
    return list;
  }

  isExpandable(): boolean {
    return this.children.length > 0;
  }

  isExpanded(): boolean {
    return this.expanded;
  }

  collapse(): boolean {
    this.expanded = false;
    return this.expanded;
  }

  expand(): boolean {
    this.expanded = true;
    return this.expanded;
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  toggleSelected(): boolean {
    this.selected = !this.selected;
    return this.selected;
  }

  isSelected(): boolean {
    return this.selected;
  }

  select(): void {
    this.selected = true;
  }

  unselect(): void {
    this.selected = false;
  }
}
