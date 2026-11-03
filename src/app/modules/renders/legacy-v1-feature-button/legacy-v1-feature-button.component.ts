import { Component, Input } from '@angular/core';
import type { FeatureSpecimen } from '../legacy-v2-feature-render/legacy-v2-feature-render.component';

/** Strip comparison specimen from infinity `v1-feature-button` (candidate B). */
@Component({
  selector: 'legacy-v1-feature-button',
  templateUrl: './legacy-v1-feature-button.component.html',
  styleUrl: './legacy-v1-feature-button.component.scss',
})
export class LegacyV1FeatureButtonComponent {
  @Input({ required: true }) feature!: FeatureSpecimen;

  private readonly defaultImage = '/media/blueprints-feature.jpeg';

  getFeatureImage(): string {
    return this.feature.imageRef || this.defaultImage;
  }

  getFeatureLabel(): string {
    return this.feature.label || 'FEATURE';
  }
}
