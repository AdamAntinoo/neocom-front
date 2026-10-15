import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AppInfoPanelComponent } from '../../panels/app-info-panel/app-info-panel.component';
import { SessionService } from '../../security/session.service';
import { BackgroundOauthEnabledComponent } from '../OauthEnabled.component';

/**
 * LOGIN-007 — NeoCom / SSO EVE Online login page (infinity v1-start-page layout).
 */
@Component({
  selector: 'login-page',
  imports: [AppInfoPanelComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent extends BackgroundOauthEnabledComponent implements OnInit {
  private readonly router = inject(Router);

  protected validating = true;
  protected loginHref = '';
  protected readonly copyright = environment.copyright;

  constructor() {
    super(inject(SessionService));
  }

  ngOnInit(): void {
    if (this.session.hasAccess()) {
      const returnUrl = this.session.getReturnUrl() ?? '/dashboard';
      void this.router.navigateByUrl(returnUrl);
      return;
    }
    this.loginHref = this.getLoginLink();
    this.validating = false;
  }
}
