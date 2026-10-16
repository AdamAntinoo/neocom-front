import { EVE_SSO_SCOPES } from './eve-sso-scopes';

export const environment = {
  production: false,
  appName: 'neocom-front',
  appVersion: '0.1.0',
  copyright: '© 2019,2024 Dimensinfin Industries',
  /** Same-origin relative base — ng serve proxy (proxy.conf.js) forwards to WireMock. */
  apiBaseUrl: '',
  ninBaseUrl: '/nin/v1',
  esiBaseUrl: '/esi/v1',
  apiPrefix: '/api',
  /** Development registration: New Neocom Infinity (LOGIN-002). Secret is a local placeholder only. */
  loginLinkData: {
    authorizeHost: 'https://login.eveonline.com/v2/oauth/authorize/',
    responseType: 'code',
    clientId: '4664722d6bd0415683a04519e738a5fc',
    clientSecret: 'local-secret-placeholder',
    redirectUri: 'http://localhost:6001/app/login-callback',
    scope: EVE_SSO_SCOPES,
  },
};
