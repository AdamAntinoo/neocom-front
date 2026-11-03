import { Injectable } from '@angular/core';
import { FeatureV1Node } from '../innovative-core/domain/nodes/feature-v1.node';

/**
 * Supplies FeatureV1 nodes for dashboard / feature-dashboard listing panels (UI-DASH-004, 009, 014).
 * Industry children are created procedurally (IND-BP-020 / IND-BP-021).
 */
@Injectable({ providedIn: 'root' })
export class FeatureCatalogProvider {
  private readonly industryChildren: FeatureV1Node[] = [
    FeatureV1Node.from({
      featureId: 'blueprint-by-location',
      label: 'Blueprint Availability',
      route: '/industry/blueprints-by-location',
      imageRef: '/media/blueprints-feature.jpeg',
    }),
    FeatureV1Node.from({
      featureId: 'manufacture',
      label: 'Manufacture',
      route: '/industry/manufacture',
      imageRef: '/media/blueprints-feature.jpeg',
    }),
  ];

  private readonly rootFeatures: FeatureV1Node[] = [
    FeatureV1Node.from({
      featureId: 'industry',
      label: 'Industry',
      route: '/industry',
      imageRef: '/media/blueprints-feature.jpeg',
    }),
  ];

  /** Features for the current parent context (`root` = Dashboard). */
  getFeatures(parentId: string = 'root'): FeatureV1Node[] {
    if (parentId === 'root') {
      return [...this.rootFeatures];
    }
    if (parentId === 'industry') {
      return [...this.industryChildren];
    }
    return [];
  }
}
