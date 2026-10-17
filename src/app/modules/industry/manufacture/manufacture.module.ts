import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../header/header.module';
import { ManufactureHomePageComponent } from './pages/manufacture-home-page/manufacture-home-page.component';
import { AvailableBlueprintsPanelComponent } from './panels/available-blueprints-panel/available-blueprints-panel.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ManufactureHomePageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HeaderModule,
    ManufactureHomePageComponent,
    AvailableBlueprintsPanelComponent,
  ],
  exports: [RouterModule],
})
export class ManufactureModule {}
