import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { catchError, of, timeout, type Subscription } from 'rxjs';
import { AppPanelComponent } from '../../../../innovative-core/components/app-panel/app-panel.component';
import { NeoComVariant } from '../../../../innovative-core/domain/NeoComVariant';
import { ViewerPanelComponent } from '../../../../shared/viewer-panel/viewer-panel.component';
import { PilotBlueprintProviderService } from '../../../../services/pilot-blueprint-provider.service';
import { BlueprintLocationAggregate } from '../../../domain/blueprint-location-aggregate';
import '../../../../renders/v1-region-render/v1-region-render.component';
import '../../../../renders/v1-system-render/v1-system-render.component';
import '../../../../renders/v1-blueprint-render/v1-blueprint-render.component';

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

  private feedSub: Subscription | null = null;

  ngOnInit(): void {
    this.setVariant(NeoComVariant.BLUEPRINT_LIST);
    this.startDownloading();
    const id = this.pilotId();

    this.feedSub = this.provider
      .observeBlueprints(id)
      .pipe(
        timeout({ first: 15_000, with: () => of(this.provider.readCache(id) ?? []) }),
        catchError(() => of(this.provider.readCache(id) ?? [])),
      )
      .subscribe((nodes) => {
        const roots = this.tree.rebuildFromNodes(nodes);
        this.completeDowload(roots);
      });
  }

  override ngOnDestroy(): void {
    this.feedSub?.unsubscribe();
    super.ngOnDestroy();
  }
}
