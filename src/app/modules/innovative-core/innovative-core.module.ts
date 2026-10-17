import { NgModule } from '@angular/core';
import { AppPanelComponent } from './components/app-panel/app-panel.component';
import { BackgroundEnabledComponent } from './components/background-enabled/background-enabled.component';

/**
 * Base components and services for the node/viewer stack.
 * Support module — no root section route.
 */
@NgModule({
  imports: [BackgroundEnabledComponent, AppPanelComponent],
  exports: [BackgroundEnabledComponent, AppPanelComponent],
})
export class InnovativeCoreModule {}
