import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {User} from "../models/user";
import {handleSharedError} from "../utilities/shared-error-handler.util";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

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
    return this.http.get(`${this.apiUrl}/activate/${activationId}`)
      .pipe(
        catchError(handleSharedError)
      );
  }
}
