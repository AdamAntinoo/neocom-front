import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-info-panel',
  templateUrl: './app-info-panel.component.html',
  styleUrl: './app-info-panel.component.scss',
})
export class AppInfoPanelComponent {
  getName(): string {
    return environment.appName.toUpperCase();
  }

  getVersion(): string {
    return environment.appVersion;
  }

  getCopyright(): string {
    return environment.copyright;
  }
}
