import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    const roles = route.data['roles'] as Array<string>;

    if (currentUser && roles.includes(currentUser.role)) {
      return true;
    }

    this.router.navigate(['/login-register'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
