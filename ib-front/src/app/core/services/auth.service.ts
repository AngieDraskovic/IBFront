import {Injectable} from '@angular/core';
import {catchError, map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Credentials} from "../models/credentials";
import {AuthToken} from "../models/auth-token";
import {environment} from "../../../environments/environment";
import {handleSharedError} from "../utilities/shared-error-handler.util";
import {OauthToken} from "../models/oauth-token";
import {extractUserFromToken, isTokenExpired} from "../utilities/auth-token.util";
import {User} from "../models/user";
import {UserRoleEnum} from "../enums/user-role.enum";
import {LoginResponse} from "../models/login-response";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  login(auth: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, auth)
      .pipe(
        catchError(handleSharedError)
      );
  }

  loginWithGoogle(oauthToken: OauthToken): Observable<void> {
    return this.http.post<AuthToken>(`${environment.apiUrl}/oauth/google`, oauthToken)
      .pipe(
        map((response) => this.handleAuthResponse(response)),
        catchError(handleSharedError)
      );
  }

  handleAuthResponse(response: AuthToken) {
    const token = response.accessToken;
    this.setToken(token);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUserRole(): UserRoleEnum {
    const user: User | null = this.getUserFromToken();
    if (user == null) {
      return UserRoleEnum.Guest;
    }

    return user.role;
  }

  getUserFromToken(): User | null {
    return extractUserFromToken(this.getToken());
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !isTokenExpired(token) : false;
  }

  private checkToken(): void {
    const token: string | null = this.getToken();
    if (token != null && this.isTokenExpired(token)) {
      localStorage.removeItem('token');
    }
  }

  isTokenExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return (Math.floor(new Date().getTime() / 1000)) >= expiry;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
