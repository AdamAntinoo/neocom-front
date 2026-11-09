import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { AssetsByLocationPageComponent } from './pages/assets-by-location-page/assets-by-location-page.component';
import { AssetsByLocationPanelComponent } from './panels/assets-by-location-panel/assets-by-location-panel.component';
import { V1CorporationPanelComponent } from './v1-corporation-panel/v1-corporation-panel.component';
import { V1PilotPanelComponent } from './v1-pilot-panel/v1-pilot-panel.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'assets-by-location' },
  {
    path: 'assets-by-location',
    component: AssetsByLocationPageComponent,
  },
];

/**
 * Pilot belongings / pilot-data pages (FAL-014).
 * Owns `v1-pilot-panel` / `v1-corporation-panel` (FAL-015).
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HeaderModule,
    AssetsByLocationPageComponent,
    AssetsByLocationPanelComponent,
    V1PilotPanelComponent,
    V1CorporationPanelComponent,
  ],
  exports: [RouterModule, V1PilotPanelComponent, V1CorporationPanelComponent],
})
export class PilotModule {}
