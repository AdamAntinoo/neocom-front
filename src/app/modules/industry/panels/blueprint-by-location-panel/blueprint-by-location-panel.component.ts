import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { catchError, of, timeout, type Subscription } from 'rxjs';
import { AppPanelComponent } from '../../../innovative-core/components/app-panel/app-panel.component';
import { NeoComVariant } from '../../../innovative-core/domain/NeoComVariant';
import { ViewerPanelComponent } from '../../../shared/viewer-panel/viewer-panel.component';
import { PilotBlueprintProviderService } from '../../../services/pilot-blueprint-provider.service';
import { BlueprintLocationAggregate } from '../../domain/blueprint-location-aggregate';
import '@renders/v1-region-render/v1-region-render.component';
import '@renders/v1-system-render/v1-system-render.component';
import '@renders/v1-blueprint-render/v1-blueprint-render.component';

/**
 * Host panel for Region → System → Blueprint hierarchy (IND-BP-033…036, 110…116 / BLP-001…003).
 * Obtains blueprints from {@link PilotBlueprintProviderService} only (no direct SSE).
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
  private readonly provider = inject(PilotBlueprintProviderService);
  private readonly tree = new BlueprintLocationAggregate();

  readonly pilotId = input(93813310);

  /** True only after a successful feed that produced zero location-chain roots. */
  readonly noLocationChain = signal(false);
  /** True when the feed failed and there was no cache to paint. */
  readonly loadFailed = signal(false);

  private feedSub: Subscription | null = null;
  private receivedFeed = false;

  ngOnInit(): void {
    this.setVariant(NeoComVariant.BLUEPRINT_LIST);
    this.startDownloading();
    const id = this.pilotId();

    // Cache-first paint (same pattern as available-blueprints) so zoneless CD has data
    // even if the live request is slow or cancelled by a remount.
    const cached = this.provider.readCache(id);
    if (cached) {
      this.applyRoots(cached);
    }

    this.feedSub = this.provider
      .observeBlueprints(id)
      .pipe(
        timeout({
          first: 15_000,
          with: () => {
            const fallback = this.provider.readCache(id);
            return fallback ? of(fallback) : of(null);
          },
        }),
        catchError(() => {
          const fallback = this.provider.readCache(id);
          return fallback ? of(fallback) : of(null);
        }),
      )
      .subscribe((nodes) => {
        if (nodes == null) {
          if (!this.receivedFeed && this.getNodes2Render().length === 0) {
            this.loadFailed.set(true);
            this.noLocationChain.set(false);
            this.completeDowload([]);
          }
          return;
        }
        this.receivedFeed = true;
        this.loadFailed.set(false);
        this.applyRoots(nodes);
      });
  }

  override ngOnDestroy(): void {
    this.feedSub?.unsubscribe();
    super.ngOnDestroy();
  }

  private applyRoots(nodes: Parameters<BlueprintLocationAggregate['rebuildFromNodes']>[0]): void {
    const roots = this.tree.rebuildFromNodes(nodes);
    this.noLocationChain.set(nodes.length > 0 && roots.length === 0);
    this.completeDowload(roots);
  }
}
