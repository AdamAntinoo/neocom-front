import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type BreadcrumbCrumb = {
  label: string;
  /** When set, crumb is a navigable link (UI-DASH-008 / UI-DASH-010). */
  route?: string | string[];
};

/**
 * Navigation breadcrumb trail for secured pages.
 * Dashboard starts the trail; each crumb links to its page when `route` is set.
 */
@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './app-breadcrumb.component.html',
  styleUrl: './app-breadcrumb.component.scss',
})
export class AppBreadcrumbComponent {
  readonly crumbs = input.required<BreadcrumbCrumb[]>();
}
