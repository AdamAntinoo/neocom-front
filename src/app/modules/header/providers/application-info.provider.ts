import { Injectable } from '@angular/core';
import { ApplicationInfoV1 } from 'neocom-domain';
import { environment } from '../../../../environments/environment';
import { ApplicationInfoV1Node } from '../../innovative-core/domain/nodes/application-info-v1.node';

/**
 * Builds ApplicationInfoV1Node for the header controller (UI-HDR-007, APPINFO-003).
 * Wire model is neocom-domain ApplicationInfoV1; the node is the NeoCom render type.
 */
@Injectable({ providedIn: 'root' })
export class ApplicationInfoProvider {
  public getApplicationInfo(): ApplicationInfoV1Node {
    return ApplicationInfoV1Node.from(
      new ApplicationInfoV1({
        name: environment.appName,
        version: environment.appVersion,
        copyright: environment.copyright,
      }),
    );
  }
}
