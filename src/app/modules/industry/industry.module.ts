import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { IndustryHomePageComponent } from './pages/industry-home-page/industry-home-page.component';
import { V1BlueprintByLocationPageComponent } from './manufacture/pages/v1-blueprint-by-location-page/v1-blueprint-by-location-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: IndustryHomePageComponent },
  {
    path: 'blueprints-by-location',
    component: V1BlueprintByLocationPageComponent,
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
    V1BlueprintByLocationPageComponent,
  ],
  exports: [RouterModule],
})
export class IndustryModule {}
