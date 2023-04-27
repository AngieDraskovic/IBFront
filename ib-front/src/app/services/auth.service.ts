import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, map } from 'rxjs';
import { UserService, environment } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export type TokenDTO = { accessToken: string, refreshToken?: string }

@Injectable({
  providedIn:"root"
})
export class AuthService {
  private roleSubject = new Subject<string>();
  role$ = this.roleSubject.asObservable();
  constructor(
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
  ) {
  }

  private accessToken?: TokenDTO = undefined;

  login(email: string, password: string) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      'email': email,
      'password': password
    };

    return this.http.post<TokenDTO>(environment.apiHost + 'api/user/login', JSON.stringify(body), { headers: loginHeaders })
      .pipe(map((res: TokenDTO) => {
        console.log(`Login success. Token ${JSON.stringify(res)}`);
        this.accessToken = res;
        localStorage.setItem("jwt", res.accessToken)
      
        return this.accessToken;
      }));


  }

  logout() {
    this.userService.setValue(null);
    localStorage.removeItem("jwt");
    this.accessToken = undefined;
    this.router.navigate(['']);
  }

  tokenIsPresent() {
    return this.accessToken?.accessToken ? true : false;
  }

  getToken() {
    return this.accessToken?.accessToken;
  }

}