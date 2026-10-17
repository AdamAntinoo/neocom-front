import { Component, input } from '@angular/core';

/** Core-only panel — exception surface for login validation. Not a route. */
@Component({
  selector: 'login-validation-exception',
  templateUrl: './login-validation-exception.component.html',
  styleUrl: './login-validation-exception.component.scss',
})
export class LoginValidationExceptionComponent {
  readonly title = input('Login validation failed');
  readonly message = input('');
}
