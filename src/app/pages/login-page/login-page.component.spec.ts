import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEOCOM_ACCESS, deleteCookie } from '../../security/cookie.util';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    deleteCookie(NEOCOM_ACCESS);
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    deleteCookie(NEOCOM_ACCESS);
  });

  it('should create the login page', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the EVE login button when there is no session', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('#appinfo-panel')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="title-message"]')?.textContent).toContain(
      'NeoCom / SSO EVE Online',
    );
    expect(root.querySelector('[cy-name="EVE-login-button"]')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="validation-message"]')).toBeNull();
  });

  it('should compose an authorize link with registered scopes and write SSO state', () => {
    const href = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLAnchorElement>('[cy-name="EVE-login-button"]')
      ?.getAttribute('href');
    expect(href).toContain('response_type=code');
    expect(href).toContain('client_id=4664722d6bd0415683a04519e738a5fc');
    expect(href).toContain(encodeURIComponent('http://localhost:6001/app/login-callback'));
    expect(href).toContain('esi-location.read_location.v1');
    expect(document.cookie).toContain('neocom_sso_state=');
  });
});
