import {AfterViewInit, Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {Credentials} from "../../models/credentials";
import {CustomError} from "../../models/custom-error";
import {RegistrationData} from "../../models/registration-data";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {UserRoleEnum} from "../../enums/user-role.enum";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {OauthToken} from "../../models/oauth-token";
import {match} from "../../../shared/utilities/match.validator";


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  siteKey = '6Le54BwmAAAAAO5Wppw-q7bP4I1rKwZoZ1c_fWyV';
  signupMode = false;

  constructor() {
  }

  ngOnInit(): void {
  }
}
