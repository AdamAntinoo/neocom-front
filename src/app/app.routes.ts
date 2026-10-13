import { Routes } from '@angular/router';
import { DashboardHomePageComponent } from './pages/dashboard-home-page/dashboard-home-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardHomePageComponent },
];
