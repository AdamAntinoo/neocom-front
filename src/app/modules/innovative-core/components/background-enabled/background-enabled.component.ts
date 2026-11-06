import { Component, OnDestroy } from '@angular/core';
import type { Subscription } from 'rxjs';

/** Holds backend Subscriptions and cleans them on destroy (NODE-006). */
@Component({
  selector: 'background-enabled',
  template: '',
})
export class BackgroundEnabledComponent implements OnDestroy {
  private readonly backendSubscriptions: Subscription[] = [];

  protected storeSubscription(subscription: Subscription): void {
    this.backendSubscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    for (const sub of this.backendSubscriptions) {
      sub.unsubscribe();
    }
    this.backendSubscriptions.length = 0;
  }
}
