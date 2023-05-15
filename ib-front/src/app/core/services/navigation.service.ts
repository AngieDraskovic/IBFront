import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {NavItem} from "../models/nav-item";
import {UserRoleEnum} from "../enums/user-role.enum";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private authService: AuthService) {}

  getNavItems(): NavItem[] {
    const user = this.authService.currentUserValue;

    if (!user) {
      return [];
    }

    if (user.role === UserRoleEnum.Admin) {
      return [
        { routeLink: '/admin/certificates', label: 'Certificates', icon: 'fa fa-solid fa-certificate' },
        { routeLink: '/admin/certificate-requests', label: 'Requests', icon: 'fa fa-solid fa-inbox' },
        { routeLink: '/admin/all-certificate-requests', label: 'All requests', icon: 'fa fa-solid fa-signal' }
      ];
    } else {
      return [
        { routeLink: '/user/ssl-certificates', label: 'Certificates', icon: 'fa fa-solid fa-certificate' },
        { routeLink: '/user/certificate-requests', label: 'Requests', icon: 'fa fa-solid fa-inbox' }
      ];
    }
  }
}
