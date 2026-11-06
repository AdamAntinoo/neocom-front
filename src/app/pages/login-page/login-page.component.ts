import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HeaderModule } from '../../modules/header/header.module';
import { NeoComVariant } from '../../modules/innovative-core/domain/NeoComVariant';
import { SessionService } from '../../security/session.service';
import {
  BackgroundOauthEnabledComponent,
  loopbackHostCorrectionUrl,
} from '../OauthEnabled.component';

/**
 * LOGIN-007 — NeoCom / SSO EVE Online login page (infinity v1-start-page layout).
 */
@Component({
  selector: 'login-page',
  imports: [HeaderModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  host: { class: 'neo-page' },
})
export class LoginPageComponent extends BackgroundOauthEnabledComponent implements OnInit {
  private readonly router = inject(Router);

  protected readonly Variant = NeoComVariant;
  protected validating = true;
  protected loginHref = '';
  protected readonly copyright = environment.copyright;

  constructor() {
    super(inject(SessionService));
  }

  ngOnInit(): void {
    // Cookie host must match EVE redirect_uri host (localhost ≠ 127.0.0.1).
    const corrected = loopbackHostCorrectionUrl(environment.loginLinkData.redirectUri);
    if (corrected != null) {
      window.location.replace(corrected);
      return;
    }
    if (this.session.hasAccess()) {
      void this.router.navigateByUrl('/character-selection');
      return;
    }
    this.loginHref = this.getLoginLink();
    this.validating = false;
  }
}
