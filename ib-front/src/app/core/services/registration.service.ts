import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {RegistrationData} from "../models/registration-data";
import {catchError, Observable} from "rxjs";
import {handleSharedError} from "../utilities/shared-error-handler.util";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private readonly apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  register(registrationData: RegistrationData, confirmationMethod: string): Observable<any> {
    let params = new HttpParams().set('confirmationMethod', confirmationMethod);
    return this.http.post<any>(`${this.apiUrl}/register`, registrationData, {params})
      .pipe(
        catchError(handleSharedError)
      );
  }
}
