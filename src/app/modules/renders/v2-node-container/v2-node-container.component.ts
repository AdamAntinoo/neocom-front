import { NgComponentOutlet } from '@angular/common';
import { Component, Input, Type } from '@angular/core';
import { BackgroundEnabledComponent } from '../../innovative-core/components/background-enabled/background-enabled.component';
import { NeoCom } from '../../innovative-core/domain/NeoCom';
import { NeoComDelayed } from '../../innovative-core/domain/NeoComDelayed';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { lookupRender } from '../render-registry';
import '../v1-blueprint-render/v1-blueprint-render.component';

@Component({
  selector: 'v2-node-container',
  imports: [NgComponentOutlet],
  templateUrl: './v2-node-container.component.html',
  styleUrl: './v2-node-container.component.scss',
})
export class V2NodeContainerComponent extends BackgroundEnabledComponent {
  @Input() container!: IViewer;
  @Input() node!: NeoCom;
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;
  @Input() index = 1;
  @Input() selectOnHover = false;

  getRenderType(): Type<unknown> | undefined {
    if (!this.node) {
      return undefined;
    }
    return lookupRender(this.node.getJsonClass());
  }

  /** Inputs passed into the resolved render via NgComponentOutlet. */
  renderInputs(): Record<string, unknown> {
    return {
      container: this.container,
      node: this.node,
      variant: this.variant,
      index: this.index,
      selectOnHover: this.selectOnHover,
    };
  }

  getNode(): NeoCom {
    return this.node;
  }

  isReady(): boolean {
    if (this.node instanceof NeoComDelayed) {
      return this.node.isReady();
    }
    return true;
  }

  toggleExpanded(): void {
    if (this.node?.isExpandable()) {
      this.node.toggleExpanded();
      this.container.notifyDataChanged();
    }
  }

  onClick(): void {
    this.node.toggleSelected();
    this.container.updateSelection(this.node);
  }

  mouseEnter(): void {
    if (this.selectOnHover) {
      this.container.enterSelected(this.node);
    }
  }
}
