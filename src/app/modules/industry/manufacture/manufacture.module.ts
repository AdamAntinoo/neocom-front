import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../header/header.module';
import { V1BlueprintByLocationPageComponent } from './pages/v1-blueprint-by-location-page/v1-blueprint-by-location-page.component';
import { ManufactureHomePageComponent } from './pages/manufacture-home-page/manufacture-home-page.component';
import { AvailableBlueprintsPanelComponent } from './panels/available-blueprints-panel/available-blueprints-panel.component';
import { BlueprintRegionsPanelComponent } from './panels/blueprint-regions-panel/blueprint-regions-panel.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ManufactureHomePageComponent },
  { path: 'blueprints', component: V1BlueprintByLocationPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HeaderModule,
    ManufactureHomePageComponent,
    V1BlueprintByLocationPageComponent,
    AvailableBlueprintsPanelComponent,
    BlueprintRegionsPanelComponent,
  ],
  exports: [RouterModule],
})
export class ManufactureModule {}