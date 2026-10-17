import { Component, Input, OnInit } from '@angular/core';
import { ProcessedBlueprint } from '../../industry/domain/processed-blueprint';
import { NeoCom } from '../../innovative-core/domain/NeoCom';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

const AVAILABLE = '-AVAILABLE-BLUEPRINTS-';


@Component({
  selector: 'v1-blueprint-render',
  templateUrl: './v1-blueprint-render.component.html',
  styleUrl: './v1-blueprint-render.component.scss',
})
export class V1BlueprintRenderComponent implements OnInit {
  @Input() container!: IViewer;
  @Input() node!: NeoCom;
  @Input() variant = '-DEFAULT-';

  static registered = false;

  static ensureRegistered(): void {
    if (V1BlueprintRenderComponent.registered) {
      return;
    }
    registerRender('ProcessedBlueprint', V1BlueprintRenderComponent);
    registerRender('ProcessedBlueprintSummary', V1BlueprintRenderComponent);
    V1BlueprintRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1BlueprintRenderComponent.ensureRegistered();
  }

  getNode(): ProcessedBlueprint {
    return this.node as ProcessedBlueprint;
  }

  isDetailed(): boolean {
    return this.variant === AVAILABLE;
  }

  getName(): string {
    return this.getNode()?.getName() ?? '-';
  }

  getBlueprintId(): number {
    return this.getNode()?.getBlueprintId() ?? 0;
  }

  getManufactureIndexLabel(): string {
    const index = this.getNode()?.getManufactureIndex();
    if (index == null) {
      return this.getNode()?.isReady() ? '—' : '…';
    }
    return String(index);
  }
}

// Eager registration so the registry is ready before first paint.
V1BlueprintRenderComponent.ensureRegistered();

export { AVAILABLE as AVAILABLE_BLUEPRINTS_VARIANT };
