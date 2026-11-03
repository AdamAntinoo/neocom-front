import { Component, Input, OnInit } from '@angular/core';
import { ProcessedBlueprint } from '../../industry/domain/processed-blueprint';
import { NeoCom } from '../../innovative-core/domain/NeoCom';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { BlueprintV1Node } from '../../innovative-core/domain/nodes/blueprint-v1.node';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

/**
 * Base identity card `v1-blueprint` for BlueprintV1Node (EPIC-010 §08 / DOM-BP-003).
 * Layout: icon lg · BLUEPRINT NAME + Open Sans bold · ME/TE Elemental · runs/maxRuns if copy.
 * Also paints ProcessedBlueprint* list variants (still to review on L1).
 */
@Component({
  selector: 'v1-blueprint-render',
  templateUrl: './v1-blueprint-render.component.html',
  styleUrl: './v1-blueprint-render.component.scss',
})
export class V1BlueprintRenderComponent implements OnInit {
  @Input() container!: IViewer;
  @Input() node!: NeoCom;
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;

  static registered = false;

  static ensureRegistered(): void {
    if (V1BlueprintRenderComponent.registered) {
      return;
    }
    registerRender('BlueprintV1', V1BlueprintRenderComponent);
    registerRender('ProcessedBlueprint', V1BlueprintRenderComponent);
    registerRender('ProcessedBlueprintSummary', V1BlueprintRenderComponent);
    V1BlueprintRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1BlueprintRenderComponent.ensureRegistered();
  }

  isBaseIdentity(): boolean {
    return this.node?.getJsonClass?.() === 'BlueprintV1';
  }

  getBlueprintV1(): BlueprintV1Node | undefined {
    return this.isBaseIdentity() && this.node instanceof BlueprintV1Node
      ? this.node
      : undefined;
  }

  getProcessed(): ProcessedBlueprint | undefined {
    return this.isBaseIdentity() ? undefined : (this.node as ProcessedBlueprint);
  }

  isDetailed(): boolean {
    return !this.isBaseIdentity() && this.variant === NeoComVariant.AVAILABLE_BLUEPRINTS;
  }

  getName(): string {
    const base = this.getBlueprintV1();
    if (base) {
      return base.getBlueprintTypeName() || '-';
    }
    return this.getProcessed()?.getName() ?? '-';
  }

  getBlueprintId(): number {
    const base = this.getBlueprintV1();
    if (base) {
      return base.getBlueprintId();
    }
    return this.getProcessed()?.getBlueprintId() ?? 0;
  }

  getBlueprintTypeIconURL(): string {
    return this.getBlueprintV1()?.getBlueprintTypeIconURL() ?? '';
  }

  getOutputTypeName(): string {
    return this.getBlueprintV1()?.getOutputTypeName() ?? '';
  }

  getOutputTypeIconURL(): string {
    return this.getBlueprintV1()?.getOutputTypeIconURL() ?? '';
  }

  getRuns(): number {
    return this.getBlueprintV1()?.getRuns() ?? 0;
  }

  getMaxRuns(): number {
    return this.getBlueprintV1()?.getMaxRuns() ?? 0;
  }

  getMaterialEfficiency(): number {
    return this.getBlueprintV1()?.getMaterialEfficiency() ?? 0;
  }

  getTimeEfficiency(): number {
    return this.getBlueprintV1()?.getTimeEfficiency() ?? 0;
  }

  /** Master / original (BPO): ESI unlimited runs (`runs < 0`). Copies show runs/maxRuns. */
  isMaster(): boolean {
    return this.getRuns() < 0;
  }

  getEfficiencyLabel(): string {
    return `${this.getMaterialEfficiency()}/${this.getTimeEfficiency()}`;
  }

  getRunsLabel(): string {
    return `${this.getRuns()}/${this.getMaxRuns()}`;
  }

  getManufactureIndexLabel(): string {
    const processed = this.getProcessed();
    const index = processed?.getManufactureIndex();
    if (index == null) {
      return processed?.isReady() ? '—' : '…';
    }
    return String(index);
  }
}

// Eager registration so the registry is ready before first paint.
V1BlueprintRenderComponent.ensureRegistered();

/** @deprecated Use {@link NeoComVariant.AVAILABLE_BLUEPRINTS} */
export const AVAILABLE_BLUEPRINTS_VARIANT = NeoComVariant.AVAILABLE_BLUEPRINTS;
