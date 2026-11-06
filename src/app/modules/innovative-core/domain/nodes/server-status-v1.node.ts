import { ServerStatusV1 } from 'neocom-domain';
import { NeoCom } from '../NeoCom';

/** Front render node for published {@link ServerStatusV1}. */
export class ServerStatusV1Node extends NeoCom {
  private readonly record: ServerStatusV1;

  constructor(source: ServerStatusV1 | object = {}) {
    super();
    this.record = source instanceof ServerStatusV1 ? source : new ServerStatusV1(source);
    this.jsonClass = 'ServerStatusV1';
  }

  static from(record: ServerStatusV1): ServerStatusV1Node {
    return new ServerStatusV1Node(record);
  }

  getRecord(): ServerStatusV1 {
    return this.record;
  }

  getServerName(): string {
    return this.record.getServerName();
  }

  getPlayersCount(): number {
    return this.record.getPlayersCount();
  }

  getStartTime(): string {
    return this.record.getStartTime();
  }

  getStartedAgo(): string {
    return this.record.getStartedAgo();
  }

  getNextDowntime(): string {
    return this.record.getNextDowntime();
  }

  getBackendVersion(): string {
    return this.record.getBackendVersion();
  }

  getSDEVersion(): string {
    return this.record.getSDEVersion();
  }
}
