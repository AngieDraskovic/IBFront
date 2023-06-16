import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, EMPTY, Observable, throwError} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "../services/notification.service";
import {LoadingService} from "../services/loading.service";
import {SocialAuthService} from "@abacritt/angularx-social-login";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService,
              private loadingService: LoadingService,
              private socialAuthService: SocialAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = this.authService.getToken();

    if (authToken && this.authService.isTokenExpired(authToken)) {
      this.loadingService.hide();
      this.loadingService.hideMain();
      setTimeout(() => {
        this.notificationService.showWarning(
          "Expired session",
          'Your session has expired, please log in again',
          'tr');
      }, 800);
      this.authService.logout();
      this.socialAuthService.signOut();
      this.router.navigate(['/login-register']);
      return EMPTY;
    }

    let authReq = request;
    if (authToken) {
      authReq = this.addToken(request, authToken);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string | null) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
