import { Component, Input } from '@angular/core';
import type { FeatureSpecimen } from '../legacy-v2-feature-render/legacy-v2-feature-render.component';

/**
 * Programme Feature button — infinity `v1-feature-button` (candidate B; IND-BP-012).
 * Candidate A (`v2-feature-render`) remains on model-strip for comparison only.
 */
@Component({
  selector: 'v1-feature-button',
  templateUrl: './legacy-v1-feature-button.component.html',
  styleUrl: './legacy-v1-feature-button.component.scss',
})
export class V1FeatureButtonComponent {
  @Input({ required: true }) feature!: FeatureSpecimen;

  private readonly defaultImage = '/media/blueprints-feature.jpeg';

  getFeatureImage(): string {
    return this.feature.imageRef || this.defaultImage;
  }

  getFeatureLabel(): string {
    return this.feature.label || 'FEATURE';
  }
}

/** @deprecated Use {@link V1FeatureButtonComponent}. */
export const LegacyV1FeatureButtonComponent = V1FeatureButtonComponent;
