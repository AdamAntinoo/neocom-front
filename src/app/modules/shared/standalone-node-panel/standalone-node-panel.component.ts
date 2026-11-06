import { NgComponentOutlet } from '@angular/common';
import { Component, Input, OnChanges, Type } from '@angular/core';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { lookupRender } from '@renders/render-registry';
import '@renders/v1-blueprint-render/v1-blueprint-render.component';

/** Minimal node shape for registry lookup (front NeoCom subclasses wrapping domain Records). */
export type StandaloneRenderableNode = { getJsonClass(): string };

/**
 * Single node + variant; registry lookup; no viewer list (NODE-007, NODE-012).
 */
@Component({
  selector: 'standalone-node-panel',
  imports: [NgComponentOutlet],
  templateUrl: './standalone-node-panel.component.html',
  styleUrl: './standalone-node-panel.component.scss',
})
export class StandaloneNodePanelComponent implements OnChanges {
  @Input() node: StandaloneRenderableNode | null = null;
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;

  renderType: Type<unknown> | null = null;

  ngOnChanges(): void {
    this.renderType = this.node ? (lookupRender(this.node.getJsonClass()) ?? null) : null;
  }

  renderInputs(): Record<string, unknown> {
    return {
      container: null,
      node: this.node,
      variant: this.variant,
    };
  }
}
