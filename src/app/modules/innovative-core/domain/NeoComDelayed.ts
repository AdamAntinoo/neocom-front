import { NeoCom } from './NeoCom';

/** Node that may paint in a partial state until enrichment completes (FASSE / NODE). */
export class NeoComDelayed extends NeoCom {
  public ready = false;

  constructor(values: object = {}) {
    super(values);
  }

  isReady(): boolean {
    return this.ready;
  }

  markReady(): void {
    this.ready = true;
  }
}
