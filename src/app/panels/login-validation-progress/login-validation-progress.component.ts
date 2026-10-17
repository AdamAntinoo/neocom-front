import { Component, input } from '@angular/core';

/** Core-only panel — progress while login validation runs. Not a route. */
@Component({
  selector: 'login-validation-progress',
  templateUrl: './login-validation-progress.component.html',
  styleUrl: './login-validation-progress.component.scss',
})
export class LoginValidationProgressComponent {
  readonly message = input('Waiting for code authentication...');
  readonly code = input<string | null>(null);
}
