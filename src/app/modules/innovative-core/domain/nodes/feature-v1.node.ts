import { NeoCom } from '../NeoCom';

/** Programme Feature domain wire for dashboard / feature-dashboard listing panels. */
export type FeatureV1Wire = {
  featureId: string;
  label: string;
  route?: string;
  imageRef?: string;
  enabled?: boolean;
  children?: FeatureV1Wire[];
};

/**
 * FeatureV1 NeoCom node for provider-driven feature lists (UI-DASH-004 / IND-BP FeatureV1).
 */
export class FeatureV1Node extends NeoCom {
  private readonly wire: FeatureV1Wire;

  constructor(source: FeatureV1Wire) {
    super();
    this.wire = { ...source, enabled: source.enabled ?? true };
    this.jsonClass = 'FeatureV1';
  }

  static from(source: FeatureV1Wire): FeatureV1Node {
    return new FeatureV1Node(source);
  }

  getFeatureId(): string {
    return this.wire.featureId;
  }

  getLabel(): string {
    return this.wire.label;
  }

  getRoute(): string | undefined {
    return this.wire.route;
  }

  getImageRef(): string {
    return this.wire.imageRef ?? '/media/blueprints-feature.jpeg';
  }

  isEnabled(): boolean {
    return this.wire.enabled !== false;
  }

  getChildFeatures(): FeatureV1Node[] {
    return (this.wire.children ?? []).map((child) => FeatureV1Node.from(child));
  }
}
