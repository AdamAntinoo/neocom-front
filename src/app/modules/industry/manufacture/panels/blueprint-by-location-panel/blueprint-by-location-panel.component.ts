import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { catchError, of, timeout, type Subscription } from 'rxjs';
import { AppPanelComponent } from '../../../../innovative-core/components/app-panel/app-panel.component';
import { BlueprintV1Node } from '../../../../innovative-core/domain/nodes/blueprint-v1.node';
import { NeoComVariant } from '../../../../innovative-core/domain/NeoComVariant';
import { ViewerPanelComponent } from '../../../../shared/viewer-panel/viewer-panel.component';
import { NodeListAdapterService } from '../../../../services/node-list-adapter.service';
import { ProcessedBlueprint } from '../../../domain/processed-blueprint';
import {
  BlueprintLocationAggregate,
  type BlueprintLocationChain,
} from '../../../domain/blueprint-location-aggregate';
import '../../../../renders/v1-region-render/v1-region-render.component';
import '../../../../renders/v1-system-render/v1-system-render.component';
import '../../../../renders/v1-blueprint-render/v1-blueprint-render.component';

/**
 * Host panel for Region → System → Blueprint hierarchy (IND-BP-033…036, 110…116).
 * Uses AppPanel collaborate2View + notifyDataChanged for expand rebuilds.
 */
@Component({
  selector: 'blueprint-by-location-panel',
  imports: [ViewerPanelComponent],
  templateUrl: './blueprint-by-location-panel.component.html',
  styleUrl: './blueprint-by-location-panel.component.scss',
})
export class BlueprintByLocationPanelComponent
  extends AppPanelComponent
  implements OnInit, OnDestroy
{
  private readonly adapter = inject(NodeListAdapterService);
  private readonly tree = new BlueprintLocationAggregate();
  private readonly byId = new Map<number, { node: BlueprintV1Node; location?: BlueprintLocationChain }>();

  readonly pilotId = input(93813310);

  private sseSub: Subscription | null = null;

  ngOnInit(): void {
    this.setVariant(NeoComVariant.SOLAR_SYSTEM_LOOKUP);
    this.startDownloading();
    const id = this.pilotId();

    const cached = this.adapter.readCache(id);
    if (cached) {
      this.applyList(cached);
    }

    this.storeSubscription(
      this.adapter
        .loadList(id)
        .pipe(
          timeout(15_000),
          catchError(() => of(cached ?? [])),
        )
        .subscribe((nodes) => this.applyList(nodes)),
    );

    this.sseSub = this.adapter.openEnrichment(id).subscribe({
      next: ({ node }) => {
        const processed = new ProcessedBlueprint({
          blueprintId: node.blueprintId,
          name: node.name,
          ready: node.ready,
          manufactureIndex: node.manufactureIndex,
          location: node.location,
        });
        this.upsertOne(processed);
      },
      error: () => {
        /* SSE optional; list paint already cleared downloading */
      },
    });
  }

  override ngOnDestroy(): void {
    this.sseSub?.unsubscribe();
    super.ngOnDestroy();
  }

  private applyList(nodes: ProcessedBlueprint[]): void {
    this.byId.clear();
    for (const item of nodes) {
      this.byId.set(item.getBlueprintId(), {
        node: toBlueprintV1(item),
        location: item.getLocation(),
      });
    }
    this.publishTree();
  }

  private upsertOne(item: ProcessedBlueprint): void {
    this.byId.set(item.getBlueprintId(), {
      node: toBlueprintV1(item),
      location: item.getLocation(),
    });
    this.publishTree();
  }

  private publishTree(): void {
    const roots = this.tree.rebuildFrom([...this.byId.values()]);
    this.completeDowload(roots);
  }
}

function toBlueprintV1(item: ProcessedBlueprint): BlueprintV1Node {
  return new BlueprintV1Node({
    blueprintId: item.getBlueprintId(),
    blueprintTypeName: item.getName(),
    runs: 0,
    materialEfficiency: 0,
    timeEfficiency: 0,
    maxRuns: 0,
  });
}
