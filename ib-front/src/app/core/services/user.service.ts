import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {User} from "../models/user";
import {handleSharedError} from "../utilities/shared-error-handler.util";
import {RenewPassword} from "../models/renew-password";
import {ResetPassword} from "../models/reset-password";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {
  }

  getUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/details`)
      .pipe(
        catchError(handleSharedError)
      );
  }

  doesEmailExist(email: string): Observable<boolean> {
    let params = new HttpParams().set('email', email);
    return this.http.get<boolean>(`${this.apiUrl}/exists`, {params})
      .pipe(
        catchError(handleSharedError)
      );
  }

  activateUserAccount(activationId: string) {
    const activation = {
      activationId: activationId
    }

    return this.http.post(`${this.apiUrl}/activate`, activation)
      .pipe(
        catchError(handleSharedError)
      );
  }

  sendMailForPasswordReset(email: string) {
    const params = new HttpParams().set('confirmationMethod', 'Email');
    return this.http.get<void>(`${this.apiUrl}/resetPassword/${email}`, {params: params})
      .pipe(
        catchError(handleSharedError)
      );
  }

  resetPassword(email: string, resetPassword: ResetPassword) {
    return this.http.put<void>(`${this.apiUrl}/resetPassword/${email}`, resetPassword)
      .pipe(
        catchError(handleSharedError)
      );
  }

  renewPassword(email: string, renewPassword: RenewPassword) {
    return this.http.put<void>(`${this.apiUrl}/renewPassword/${email}`, renewPassword)
      .pipe(
        catchError(handleSharedError)
      );
  }
}
