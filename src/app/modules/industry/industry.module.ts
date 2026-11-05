import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { IndustryHomePageComponent } from './pages/industry-home-page/industry-home-page.component';
import { BlueprintByLocationPageComponent } from './manufacture/pages/blueprint-by-location-page/blueprint-by-location-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: IndustryHomePageComponent },
  {
    path: 'blueprints-by-location',
    component: BlueprintByLocationPageComponent,
  },
  {
    path: 'manufacture',
    loadChildren: () =>
      import('./manufacture/manufacture.module').then((m) => m.ManufactureModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HeaderModule,
    IndustryHomePageComponent,
    BlueprintByLocationPageComponent,
  ],
  exports: [RouterModule],
})
export class IndustryModule {}
