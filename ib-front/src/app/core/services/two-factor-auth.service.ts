import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {handleSharedError} from "../utilities/shared-error-handler.util";
import {TwoFAMethodRequest} from "../models/two-fa-method-request";
import {VerificationRequest} from "../models/verification-request";
import {AuthToken} from "../models/auth-token";

@Injectable({
  providedIn: 'root'
})
export class TwoFactorAuthService {
  private readonly basePath = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  select2FAMethod(twoFAMethodRequestDTO: TwoFAMethodRequest): Observable<string> {
    return this.http.post<string>(`${this.basePath}/2fa/method`, twoFAMethodRequestDTO, { responseType: 'text' as 'json' })
      .pipe(
        catchError(handleSharedError)
      );
  }

  verify2FA(verificationRequestDTO: VerificationRequest): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.basePath}/2fa/verify`, verificationRequestDTO)
      .pipe(
        catchError(handleSharedError)
      );
  }
}
