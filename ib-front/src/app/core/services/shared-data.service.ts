import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ConfirmationData} from "../models/confirmation-data";
import {LoginData} from "../models/login-data";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private authData = new BehaviorSubject<{ email: string; password: string } | null>(null);
  authData$ = this.authData.asObservable();

  private loginData = new BehaviorSubject<LoginData | null>(null);
  loginData$ = this.loginData.asObservable();

  private confirmationMethodSubject = new BehaviorSubject<ConfirmationData | null>(null);
  confirmationMethod$ = this.confirmationMethodSubject.asObservable();

  setAuthData(data: { email: string; password: string } | null) {
    this.authData.next(data);
  }

  setLoginData(data: LoginData | null) {
    this.loginData.next(data);
  }

  setConfirmationMethod(confirmationData: ConfirmationData): void {
    this.confirmationMethodSubject.next(confirmationData);
  }
}
