import { Component } from '@angular/core';
import { ApplicationInfoV1, ServerStatusV1 } from 'neocom-domain';
import { NeoComVariant } from '../../modules/innovative-core/domain/NeoComVariant';
import { ProcessedBlueprintSummary } from '../../modules/industry/domain/processed-blueprint';
import { V1ApplicationInfoRenderComponent } from '../../modules/renders/v1-application-info-render/v1-application-info-render.component';
import { V1BlueprintRenderComponent } from '../../modules/renders/v1-blueprint-render/v1-blueprint-render.component';
import { V1ServerStatusRenderComponent } from '../../modules/renders/v1-server-status-render/v1-server-status-render.component';

/**
 * Visual catalog for EPIC-004 model appearances.
 * Route `/model-strip` renders each model with the application panel styles
 * so those frames can be captured into the epic.
 */
@Component({
  selector: 'model-strip-page',
  imports: [
    V1ApplicationInfoRenderComponent,
    V1BlueprintRenderComponent,
    V1ServerStatusRenderComponent,
  ],
  templateUrl: './model-strip-page.component.html',
  styleUrl: './model-strip-page.component.scss',
  host: { class: 'neo-page' },
})
export class ModelStripPageComponent {
  protected readonly detailed = NeoComVariant.AVAILABLE_BLUEPRINTS;

  protected portrait =
    'https://images.evetech.net/characters/93813310/portrait?size=64';

  protected readonly appInfo = new ApplicationInfoV1({
    name: 'NeoCom-Infinity',
    version: '0.20.0-435 dev',
    copyright: '© 2019,2024 Dimensinfin Industries',
  });

  protected readonly serverStatus = new ServerStatusV1({
    server: 'tranquility',
    players: 26172,
    backendVersion: '0.20.0',
    SDEVersion: '20201231-APP',
    nextDowntime: 'Downtime in 19 hours',
  });

  protected readonly blueprint = new ProcessedBlueprintSummary({
    blueprintId: 31717,
    name: 'Small EM Shield Reinforcer I Blueprint',
    manufactureIndex: 199,
  });

  protected useDefaultPortrait(): void {
    this.portrait = 'https://images.evetech.net/characters/1/portrait?size=64';
  }
}
