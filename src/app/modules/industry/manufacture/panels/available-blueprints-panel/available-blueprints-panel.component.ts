import { Component, OnInit } from '@angular/core';
import { AppPanelComponent } from '../../../../innovative-core/components/app-panel/app-panel.component';
import { ProcessedBlueprint } from '../../../domain/processed-blueprint';
import { ViewerPanelComponent } from '../../../../shared/viewer-panel/viewer-panel.component';
import { AVAILABLE_BLUEPRINTS_VARIANT } from '../../../../renders/v1-blueprint-render/v1-blueprint-render.component';

/**
 * Manufacture available-blueprints panel: sets variant, downloads nodes, hosts viewer (NODE-005).
 */
@Component({
  selector: 'available-blueprints-panel',
  imports: [ViewerPanelComponent],
  templateUrl: './available-blueprints-panel.component.html',
  styleUrl: './available-blueprints-panel.component.scss',
})
export class AvailableBlueprintsPanelComponent extends AppPanelComponent implements OnInit {
  ngOnInit(): void {
    this.setVariant(AVAILABLE_BLUEPRINTS_VARIANT);
    this.startDownloading();
    // Placeholder sample until front-async-sse wires the adapter.
    const sample = [
      new ProcessedBlueprint({
        blueprintId: 1001,
        name: 'Sample Blueprint',
        ready: true,
        manufactureIndex: 1.25,
      }),
      new ProcessedBlueprint({
        blueprintId: 1002,
        name: 'Delayed Blueprint',
        ready: false,
        manufactureIndex: null,
      }),
    ];
    this.completeDowload(sample);
  }
}
