import { Component, Input, OnInit } from '@angular/core';
import { NeoCom } from '../../innovative-core/domain/NeoCom';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { BlueprintV1Node } from '@domain';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

/**
 * Base identity card `v1-blueprint` for BlueprintV1Node.
 * Render registration name = jsonClass `BlueprintV1` (DEF-BLP-011).
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
  /** Bound by `v2-node-container` via NgComponentOutlet (unused here). */
  @Input() index = 1;
  @Input() selectOnHover = false;

  static registered = false;

  static ensureRegistered(): void {
    if (V1BlueprintRenderComponent.registered) {
      return;
    }
    registerRender('BlueprintV1', V1BlueprintRenderComponent);
    V1BlueprintRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1BlueprintRenderComponent.ensureRegistered();
  }

  getBlueprintV1(): BlueprintV1Node | undefined {
    return this.node instanceof BlueprintV1Node ? this.node : undefined;
  }

  isDetailed(): boolean {
    return this.variant === NeoComVariant.AVAILABLE_BLUEPRINTS;
  }

  getName(): string {
    return this.getBlueprintV1()?.getBlueprintTypeName() || '-';
  }

  getBlueprintId(): number {
    return this.getBlueprintV1()?.getBlueprintId() ?? 0;
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
    const bp = this.getBlueprintV1();
    const index = bp?.getManufactureIndex();
    if (index == null) {
      return bp?.isReady() ? '—' : '…';
    }
    return String(index);
  }
}

V1BlueprintRenderComponent.ensureRegistered();

/** @deprecated Use {@link NeoComVariant.AVAILABLE_BLUEPRINTS} */
export const AVAILABLE_BLUEPRINTS_VARIANT = NeoComVariant.AVAILABLE_BLUEPRINTS;
