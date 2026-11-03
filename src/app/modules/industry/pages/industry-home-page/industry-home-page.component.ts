import { Component } from '@angular/core';
import { HeaderModule } from '../../../header/header.module';
import { AppBreadcrumbComponent } from '../../../shared/breadcrumb/app-breadcrumb.component';
import { FeatureListPanelComponent } from '../../../shared/feature-list-panel/feature-list-panel.component';

/**
 * Industry feature dashboard — secured chrome + scoped subfeature list (UI-DASH-012…014).
 */
@Component({
  selector: 'industry-home-page',
  imports: [HeaderModule, AppBreadcrumbComponent, FeatureListPanelComponent],
  templateUrl: './industry-home-page.component.html',
  styleUrl: './industry-home-page.component.scss',
  host: { class: 'neo-page' },
})
export class IndustryHomePageComponent {
  protected readonly crumbs = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Industry', route: '/industry' },
  ];
}
