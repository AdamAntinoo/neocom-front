import { ApplicationInfoV1 } from 'neocom-domain';
import { NeoCom } from '../NeoCom';

/** Front render node for published {@link ApplicationInfoV1}. */
export class ApplicationInfoV1Node extends NeoCom {
  private readonly record: ApplicationInfoV1;

  constructor(source: ApplicationInfoV1 | object = {}) {
    super();
    this.record = source instanceof ApplicationInfoV1 ? source : new ApplicationInfoV1(source);
    this.jsonClass = 'ApplicationInfoV1';
  }

  static from(record: ApplicationInfoV1): ApplicationInfoV1Node {
    return new ApplicationInfoV1Node(record);
  }

  getRecord(): ApplicationInfoV1 {
    return this.record;
  }

  getName(): string {
    return this.record.getName();
  }

  getVersion(): string {
    return this.record.getVersion();
  }

  getCopyright(): string {
    return this.record.getCopyright();
  }
}
