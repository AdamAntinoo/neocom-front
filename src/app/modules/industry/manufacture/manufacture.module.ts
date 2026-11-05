import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../header/header.module';
import { BlueprintByLocationPageComponent } from './pages/blueprint-by-location-page/blueprint-by-location-page.component';
import { ManufactureHomePageComponent } from './pages/manufacture-home-page/manufacture-home-page.component';
import { AvailableBlueprintsPanelComponent } from './panels/available-blueprints-panel/available-blueprints-panel.component';
import { BlueprintByLocationPanelComponent } from './panels/blueprint-by-location-panel/blueprint-by-location-panel.component';
import { BlueprintRegionsPanelComponent } from './panels/blueprint-regions-panel/blueprint-regions-panel.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ManufactureHomePageComponent },
  /** Legacy seed path — prefer `/industry/blueprints-by-location`. */
  { path: 'blueprints', redirectTo: '/industry/blueprints-by-location', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HeaderModule,
    ManufactureHomePageComponent,
    BlueprintByLocationPageComponent,
    AvailableBlueprintsPanelComponent,
    BlueprintByLocationPanelComponent,
    BlueprintRegionsPanelComponent,
  ],
  exports: [RouterModule],
})
export class ManufactureModule {}