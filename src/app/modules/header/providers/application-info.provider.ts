import { Injectable } from '@angular/core';
import { ApplicationInfoV1 } from 'neocom-domain';
import { environment } from '../../../../environments/environment';

/**
 * Builds ApplicationInfoV1 for the header controller (UI-HDR-007, APPINFO-003).
 */
@Injectable({ providedIn: 'root' })
export class ApplicationInfoProvider {
  public getApplicationInfo(): ApplicationInfoV1 {
    return new ApplicationInfoV1({
      name: environment.appName,
      version: environment.appVersion,
      copyright: environment.copyright,
    });
  }
}
