import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureCatalogProvider } from '../../services/feature-catalog.provider';
import { LegacyV1FeatureButtonComponent } from '../../renders/legacy-v1-feature-button/legacy-v1-feature-button.component';

/**
 * Listing panel: provider supplies FeatureV1 data; each item uses the feature render (UI-DASH-004 / 009).
 */
@Component({
  selector: 'feature-list-panel',
  imports: [LegacyV1FeatureButtonComponent],
  templateUrl: './feature-list-panel.component.html',
  styleUrl: './feature-list-panel.component.scss',
})
export class FeatureListPanelComponent {
  private readonly catalog = inject(FeatureCatalogProvider);
  private readonly router = inject(Router);

  /** Parent feature id; `root` for Dashboard. */
  readonly parentId = input('root');

  protected features() {
    return this.catalog.getFeatures(this.parentId());
  }

  protected onSelect(route: string | undefined): void {
    if (route) {
      void this.router.navigateByUrl(route);
    }
  }
}
