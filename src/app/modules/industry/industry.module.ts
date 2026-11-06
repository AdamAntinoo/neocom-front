import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { AvailableBlueprintsPanelComponent } from './panels/available-blueprints-panel/available-blueprints-panel.component';
import { BlueprintByLocationPanelComponent } from './panels/blueprint-by-location-panel/blueprint-by-location-panel.component';
import { BlueprintRegionsPanelComponent } from './panels/blueprint-regions-panel/blueprint-regions-panel.component';
import { BlueprintByLocationPageComponent } from './pages/blueprint-by-location-page/blueprint-by-location-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'blueprints-by-location' },
  {
    path: 'blueprints-by-location',
    component: BlueprintByLocationPageComponent,
  },
  /** Former ManufactureModule routes (DEF-BLP-006); keep redirects for old URLs. */
  { path: 'manufacture', pathMatch: 'full', redirectTo: 'blueprints-by-location' },
  { path: 'manufacture/blueprints', pathMatch: 'full', redirectTo: 'blueprints-by-location' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HeaderModule,
    BlueprintByLocationPageComponent,
    AvailableBlueprintsPanelComponent,
    BlueprintByLocationPanelComponent,
    BlueprintRegionsPanelComponent,
  ],
  exports: [RouterModule],
})
export class IndustryModule {}
