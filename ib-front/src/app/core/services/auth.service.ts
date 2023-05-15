import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable} from "rxjs";
import {User} from "../models/user";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Credentials} from "../models/credentials";
import {AuthToken} from "../models/auth-token";
import {environment} from "../../../environments/environment";
import {handleSharedError} from "../../shared/utilities/shared-error-handler.util";
import {RegistrationData} from "../models/registration-data";
import jwt_decode from "jwt-decode";
import {UserRoleEnum} from "../enums/user-role.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(auth: Credentials): Observable<string> {
    return this.http.post<AuthToken>(`${environment.apiUrl}/user/login`, auth)
      .pipe(
        map((response) => {
          const token = response.accessToken;
          const user = this.getUserFromToken(token);
          if (user) {
            user.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
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
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  private getUserFromToken(token?: string): User | null {
    token = token || JSON.parse(localStorage.getItem('user') || '{}').token;
    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwt_decode(token);
      const role = this.mapRole(decodedToken.role);
      return {
        id: decodedToken.jti,
        email: decodedToken.sub,
        role: role,
        token,
      };
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  private mapRole(roleString: string): UserRoleEnum {
    switch (roleString) {
      case 'ROLE_ADMIN':
        return UserRoleEnum.Admin;
      case 'ROLE_USER':
        return UserRoleEnum.User;
      default:
        return UserRoleEnum.Guest;
    }
  }
}
