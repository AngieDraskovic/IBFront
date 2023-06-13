import {Component, OnInit} from '@angular/core';
import {AuthService} from "./core/services/auth.service";
import {UserRoleEnum} from "./core/enums/user-role.enum";
import {NavigationStart, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ib-front';

  constructor(private router: Router,
              private authService: AuthService,
              private dialog: MatDialog) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.url === '/login-register') {
        const dialogs = this.dialog.openDialogs;
        for (let dialog of dialogs) {
          dialog.close();
        }
      }
    });
  }

  ngOnInit() {
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      if (this.authService.getUserRole() === UserRoleEnum.Admin) {
        this.router.navigate(['/admin']);
      } else if (this.authService.getUserRole() === UserRoleEnum.User) {
        this.router.navigate(['/user']);
      }
    }
  }
}
