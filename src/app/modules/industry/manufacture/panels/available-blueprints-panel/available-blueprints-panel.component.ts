import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AppPanelComponent } from '../../../../innovative-core/components/app-panel/app-panel.component';
import { ProcessedBlueprint } from '../../../domain/processed-blueprint';
import { ViewerPanelComponent } from '../../../../shared/viewer-panel/viewer-panel.component';
import { NeoComVariant } from '../../../../innovative-core/domain/NeoComVariant';
import { NodeListAdapterService } from '../../../../services/node-list-adapter.service';
import type { Subscription } from 'rxjs';

/**
 * Manufacture available-blueprints panel: adapter cache → HTTP → SSE merge (FASSE-001…006).
 */
@Component({
  selector: 'available-blueprints-panel',
  imports: [ViewerPanelComponent],
  templateUrl: './available-blueprints-panel.component.html',
  styleUrl: './available-blueprints-panel.component.scss',
})
export class AvailableBlueprintsPanelComponent extends AppPanelComponent implements OnInit, OnDestroy {
  private readonly adapter = inject(NodeListAdapterService);
  readonly pilotId = input(93813310);

  private sseSub: Subscription | null = null;

  ngOnInit(): void {
    this.setVariant(NeoComVariant.AVAILABLE_BLUEPRINTS);
    this.startDownloading();
    const id = this.pilotId();

    // Cache-first paint, then HTTP if miss; always open SSE for enrichment.
    const cached = this.adapter.readCache(id);
    if (cached) {
      this.completeDowload(cached);
    }

    this.storeSubscription(
      this.adapter.loadList(id).subscribe({
        next: (nodes) => this.completeDowload(nodes),
        error: () => {
          if (!cached) {
            this.completeDowload([]);
          }
        },
      }),
    );

    this.sseSub = this.adapter.openEnrichment(id).subscribe({
      next: ({ node }) => this.mergeEnrichedRow(node.blueprintId, node),
    });
  }

  override ngOnDestroy(): void {
    this.sseSub?.unsubscribe();
    super.ngOnDestroy();
  }

  /**
   * In-place row refresh: replace node in dataModelRoot and rebuild flat list (FASSE-005).
   */
  private mergeEnrichedRow(
    blueprintId: number,
    dto: {
      blueprintId: number;
      name: string;
      ready: boolean;
      manufactureIndex: number | null;
    },
  ): void {
    const updated = new ProcessedBlueprint({
      blueprintId: dto.blueprintId,
      name: dto.name,
      ready: dto.ready,
      manufactureIndex: dto.manufactureIndex,
    });
    const roots = this.dataModelRoot as ProcessedBlueprint[];
    const idx = roots.findIndex((n) => n.getBlueprintId() === blueprintId);
    if (idx >= 0) {
      roots[idx] = updated;
    } else {
      roots.push(updated);
    }
    this.dataModelRoot = [...roots];
    this.notifyDataChanged();
  }
}
