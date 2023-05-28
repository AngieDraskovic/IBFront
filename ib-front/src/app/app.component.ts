import {Component, OnInit} from '@angular/core';
import {AuthService} from "./core/services/auth.service";
import {UserRoleEnum} from "./core/enums/user-role.enum";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ib-front';

  constructor(private router: Router,
              private authService: AuthService) {
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
