import { NeoCom } from './NeoCom';

/** Node that may paint in a partial state until enrichment completes (FASSE / NODE). */
export class NeoComDelayed extends NeoCom {
  public ready: boolean;

  constructor(values: object = {}) {
    super(values);
    const v = values as { ready?: boolean };
    this.ready = v.ready ?? false;
  }

  isReady(): boolean {
    return this.ready;
  }

  markReady(): void {
    this.ready = true;
  }
}
