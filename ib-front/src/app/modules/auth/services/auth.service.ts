import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable} from "rxjs";
import {Credentials} from "../model/credentials";
import {AuthToken} from "../model/auth-token";
import jwt_decode from 'jwt-decode';
import {RegistrationData} from "../model/registration-data";
import {User} from "../model/user";
import {environment} from "../../../../environments/environment";
import {handleSharedError} from "../../shared/error/shared-error-handler";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentTokenSubject: BehaviorSubject<string | null>;
  public currentToken: Observable<string | null>;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    this.currentToken = this.currentTokenSubject.asObservable();
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentTokenValue(): string | null {
    return this.currentTokenSubject.value;
  }

  login(auth: Credentials): Observable<string> {
    return this.http.post<AuthToken>(`${environment.apiUrl}/user/login`, auth)
      .pipe(
        map(response => {
          const token = response.accessToken;
          localStorage.setItem('token', token);
          this.currentTokenSubject.next(token);
          const user = this.getUserFromToken();
          this.currentUserSubject.next(user);
          return token;
        }),
        catchError(handleSharedError)
      );
  }

  register(registrationData: RegistrationData, confirmationMethod: string): Observable<any> {
    let params = new HttpParams().set('confirmationMethod', confirmationMethod);
    return this.http.post<any>(`${environment.apiUrl}/user/register`, registrationData, {params})
      .pipe(
        catchError(handleSharedError)
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentTokenSubject.next(null);
  }

  private getUserFromToken(): User | null {
    const token = this.currentTokenValue;
    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwt_decode(token);
      console.log(decodedToken);
      return {
        id: decodedToken.jti,
        email: decodedToken.sub,
        role: decodedToken.role,
      };
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }
}
