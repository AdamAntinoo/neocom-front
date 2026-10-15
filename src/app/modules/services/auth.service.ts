import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthCallbackResult {
  characterId: number;
  characterName: string;
}

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);

  exchangeCode(code: string, state: string): Observable<AuthCallbackResult> {
    return this.http.post<AuthCallbackResult>(`${environment.apiBaseUrl}/v1/auth/callback`, {
      code,
      state,
    });
  }
}
