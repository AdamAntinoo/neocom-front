import { Injectable } from '@angular/core';
import { FeatureV1Node } from '../innovative-core/domain/nodes/feature-v1.node';

/**
 * Supplies FeatureV1 nodes for dashboard feature listing (UI-DASH-004, 009, 014).
 * At project start, root exposes all early pages (DEF-BLP-006).
 */
@Injectable({ providedIn: 'root' })
export class FeatureCatalogProvider {
  private readonly rootFeatures: FeatureV1Node[] = [
    FeatureV1Node.from({
      featureId: 'blueprint-list',
      label: 'Blueprint Availability',
      route: '/industry/blueprints-by-location',
      imageRef: '/media/blueprints-feature.jpeg',
    }),
    FeatureV1Node.from({
      featureId: 'assets-by-location',
      label: 'Assets by Location',
      route: '/pilot/assets-by-location',
      imageRef: '/media/blueprints-feature.jpeg',
    }),
    FeatureV1Node.from({
      featureId: 'model-strip',
      label: 'Model strip',
      route: '/model-strip',
      imageRef: '/media/blueprints-feature.jpeg',
    }),
    FeatureV1Node.from({
      featureId: 'color-table',
      label: 'Colour table',
      route: '/color-table',
      imageRef: '/media/blueprints-feature.jpeg',
    }),
  ];

  /** Features for the current parent context (`root` = Dashboard). */
  getFeatures(parentId: string = 'root'): FeatureV1Node[] {
    if (parentId === 'root') {
      return [...this.rootFeatures];
    }
    return [];
  }
}
