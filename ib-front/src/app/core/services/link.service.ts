import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {NavItem} from "../../shared/interfaces/nav-item";
import {Role} from "../enums/role";

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  constructor(private authService: AuthService) {}

  getNavItems(): NavItem[] {
    const user = this.authService.currentUserValue;

    if (!user) {
      return [];
    }

    if (user.role === Role.Admin) {
      return [
        { routeLink: 'admin/dashboard', label: 'Certificates', icon: 'fa fa-duotone fa-lock' },
        { routeLink: 'admin/certificate-requests', label: 'Requests', icon: 'fa fa-duotone fa-lock' }
      ];
    } else {
      return [
        { routeLink: '/user/ssl-certificates', label: 'Certificates', icon: 'fa fa-solid fa-certificate' },
        { routeLink: '/user/certificate-requests', label: 'Requests', icon: 'fa fa-duotone fa-lock' }
      ];
    }
  }
}
