/**
 * Symbolic name → selector translation (CICD-F-065).
 * Scenarios name logical types; this table resolves component tags / cy-* attributes.
 */
export class SupportService {
  private readonly tags: Record<string, string> = {
    login: '[cy-section-name="login"]',
    'login-page': '[cy-section-name="login"]',
    dashboard: '[cy-section-name="dashboard-home"]',
    'dashboard-home': '[cy-section-name="dashboard-home"]',
    'app-page': '[cy-section-name="app-page"]',
    'app-info': '[cy-section-name="app-info"]',
    'server-info': '[cy-section-name="server-info"]',
    'character-selection': '[cy-section-name="character-selection"]',
    'blueprint-by-location': '[cy-section-name="blueprint-by-location"]',
    'assets-by-location': '[cy-section-name="assets-by-location"]',
    breadcrumb: '[cy-section-name="breadcrumb"]',
    'feature-list': '[cy-section-name="feature-list"]',
    pilot: '[cy-element-name="pilot"][cy-element-type="panel"]',
    'pilot-panel': '[cy-section-name="v1-pilot"]',
    'v1-pilot': '[cy-section-name="v1-pilot"]',
    dialog: '[cy-dialog]',
  };

  private readonly paths: Record<string, string> = {
    home: '/app/',
    login: '/app/login',
    'login-callback': '/app/login-callback',
    'character-selection': '/app/character-selection',
    dashboard: '/app/dashboard',
    'industry-blueprints-by-location': '/app/industry/blueprints-by-location',
    'pilot-assets-by-location': '/app/pilot/assets-by-location',
  };

  translateTag(symbolicName: string): string {
    const key = symbolicName.trim().toLowerCase();
    return this.tags[key] ?? `[cy-section-name="${symbolicName}"]`;
  }

  translatePath(symbolicName: string): string {
    const key = symbolicName.trim().toLowerCase();
    return this.paths[key] ?? symbolicName;
  }

  fieldLabel(name: string): string {
    return `[cy-field-label="${name}"]`;
  }

  fieldValue(name: string): string {
    return `[cy-field-value="${name}"]`;
  }

  named(name: string): string {
    return `[cy-name="${name}"]`;
  }

  render(name: string): string {
    return `[cy-render="${name}"]`;
  }

  section(name: string): string {
    return `[cy-section-name="${name}"]`;
  }
}
