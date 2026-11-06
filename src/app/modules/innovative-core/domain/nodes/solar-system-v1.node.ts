import { NeoCom } from '../NeoCom';

/**
 * Front NeoCom for SolarSystem (DEF-BLP-007…009, 012).
 * Blueprint counts come from {@link NeoCom.getChildren}.
 */
export class SolarSystemV1Node extends NeoCom {
  name: string;
  solarSystemId?: number;

  constructor(values: { name?: string; solarSystemId?: number } = {}) {
    super();
    this.jsonClass = 'SolarSystemV1';
    this.name = values.name ?? '-';
    this.solarSystemId = values.solarSystemId;
  }

  getName(): string {
    return this.name;
  }

  /** Blueprint leaves under this system. */
  getBlueprintsCount(): number {
    return this.getChildren().length;
  }
}
