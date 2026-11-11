import { Routes } from '@angular/router';
import { CharacterSelectionPageComponent } from './pages/character-selection-page/character-selection-page.component';
import { ColorTablePageComponent } from './pages/color-table-page/color-table-page.component';
import { DashboardHomePageComponent } from './pages/dashboard-home-page/dashboard-home-page.component';
import { LoginCallbackPageComponent } from './pages/login-callback-page/login-callback-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ModelStripPageComponent } from './pages/model-strip-page/model-strip-page.component';
import { authGuard } from './security/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'model-strip', component: ModelStripPageComponent },
  { path: 'color-table', component: ColorTablePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'login-callback', component: LoginCallbackPageComponent },
  {
    path: 'character-selection',
    component: CharacterSelectionPageComponent,
    canActivate: [authGuard],
  },
  { path: 'dashboard', component: DashboardHomePageComponent, canActivate: [authGuard] },
  {
    path: 'industry',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/industry/industry.module').then((m) => m.IndustryModule),
  },
  {
    path: 'pilot',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/pilot/pilot.module').then((m) => m.PilotModule),
  },
];
