import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {NavItem} from "../../interfaces/nav-item";
import {LinkService} from "../../../core/services/link.service";
import {AuthService} from "../../../core/services/auth.service";

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  hideMenu: boolean = false;
  screenWidth = 0;

  navItems: NavItem[] = [];

  constructor(private authService: AuthService, private linkService: LinkService) {
  }

  ngOnInit(): void {
    this.navItems = this.linkService.getNavItems();
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.hideMenu = true;
      this.onToggleSideNav.emit({collapsed: this.hideMenu, screenWidth: this.screenWidth});
    }
  }

  toggleMenu() {
    this.hideMenu = !this.hideMenu;
  }

  logOut() {
    this.authService.logout();
  }
}
