import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { catchError, of, timeout, type Subscription } from 'rxjs';
import { AppPanelComponent } from '../../../innovative-core/components/app-panel/app-panel.component';
import { NeoComVariant } from '../../../innovative-core/domain/NeoComVariant';
import { ViewerPanelComponent } from '../../../shared/viewer-panel/viewer-panel.component';
import { PilotAssetProviderService } from '../../../services/pilot-asset-provider.service';
import { SpaceLocationService } from '../../../services/space-location.service';
import { AssetLocationAggregate } from '../../domain/asset-location-aggregate';
import '@renders/v1-region-render/v1-region-render.component';
import '@renders/v1-system-render/v1-system-render.component';
import '@renders/v1-asset-render/v1-asset-render.component';
import '@renders/v1-unidentified-location-render/v1-unidentified-location-render.component';

/**
 * Host panel: Region / Unidentified → System → Asset/Container (FAL-012…013, 020…035).
 */
@Component({
  selector: 'assets-by-location-panel',
  imports: [ViewerPanelComponent],
  templateUrl: './assets-by-location-panel.component.html',
  styleUrl: './assets-by-location-panel.component.scss',
})
export class AssetsByLocationPanelComponent
  extends AppPanelComponent
  implements OnInit, OnDestroy
{
  private readonly provider = inject(PilotAssetProviderService);
  private readonly locations = inject(SpaceLocationService);
  private readonly tree = new AssetLocationAggregate();

  readonly pilotId = input(93813310);
  readonly loadFailed = signal(false);

  private feedSub: Subscription | null = null;
  private receivedFeed = false;

  ngOnInit(): void {
    // Same hierarchy host variant as blueprints-by-location so region/system cards paint.
    this.setVariant(NeoComVariant.BLUEPRINT_LIST);
    this.startDownloading();
    const id = this.pilotId();

    const cached = this.provider.readCache(id);
    if (cached) {
      void this.applyAssets(cached);
    }

    this.feedSub = this.provider
      .observeAssets(id)
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
            this.completeDowload([]);
          }
          return;
        }
        this.receivedFeed = true;
        this.loadFailed.set(false);
        void this.applyAssets(nodes);
      });
  }

  override ngOnDestroy(): void {
    this.feedSub?.unsubscribe();
    super.ngOnDestroy();
  }

  private async applyAssets(
    nodes: Parameters<AssetLocationAggregate['rebuild']>[0],
  ): Promise<void> {
    const roots = await this.tree.rebuild(nodes, this.locations);
    this.completeDowload(roots);
  }
}
