import { Component } from '@angular/core';
import { HeaderModule } from '../../../../header/header.module';
import { AvailableBlueprintsPanelComponent } from '../../panels/available-blueprints-panel/available-blueprints-panel.component';

@Component({
  selector: 'manufacture-home-page',
  imports: [HeaderModule, AvailableBlueprintsPanelComponent],
  templateUrl: './manufacture-home-page.component.html',
  styleUrl: './manufacture-home-page.component.scss',
})
export class ManufactureHomePageComponent {}
