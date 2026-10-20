import { Routes } from '@angular/router';
import { DashboardHomePageComponent } from './pages/dashboard-home-page/dashboard-home-page.component';
import { LoginCallbackPageComponent } from './pages/login-callback-page/login-callback-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ModelStripPageComponent } from './pages/model-strip-page/model-strip-page.component';
import { authGuard } from './security/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'model-strip', component: ModelStripPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'login-callback', component: LoginCallbackPageComponent },
  { path: 'dashboard', component: DashboardHomePageComponent, canActivate: [authGuard] },
  {
    path: 'industry',
    loadChildren: () =>
      import('./modules/industry/industry.module').then((m) => m.IndustryModule),
  },
];
