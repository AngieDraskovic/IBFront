import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private value$ = new BehaviorSubject<any>({});
  selectedValue$ = this.value$.asObservable(); 

  constructor(private http : HttpClient) {}
  setValue(test: any) {          
    this.value$.next(test);
  }

  getUser(): Observable<UserMe> {
    return this.http.get<UserMe>(environment.apiHost + 'api/user/me');
  }


  registerUser(userRequest:UserRequest, confirmationMethod:string):Observable<UserDetails>{
    return this.http.post<UserRequest>(environment.apiHost + `api/user/register?confirmationMethod=${confirmationMethod}`, userRequest);
  }

  activateUser(activationId:string){
    return this.http.get<UserRequest>(environment.apiHost + 'api/user/activate/' + activationId);
  }
}

export interface UserRequest{
  name:string,
  surname:string,
  email:string,
  telephoneNumber:string,
  password:string;
}

export interface UserDetails{
  name:string,
  surname:string,
  email:string,
  telephoneNumber:string;
}

export interface UserMe{
  name:string,
  surname:string,
  email:string,
  telephoneNumber:string;
  authorityDTO:Authority;
}

export interface Authority{
  authorityName:string;
}

export const environment = {
  production: false,
  apiHost: 'http://localhost:8080/',
};
