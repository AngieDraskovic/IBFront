import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { ResetPasswordDTO, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{
  newPassword:string = '';
  confirmPassword:string = '';
  verificationID: string = '';
  email:string = '';


  ngOnInit(){
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  constructor(private userService:UserService,
              private router: Router,
              private route: ActivatedRoute,
              private sharedService:SharedService,
              private authService: AuthService
              ){}

  handleError(error: HttpErrorResponse) {
    console.log(error);
    alert("An error occurred: " + error.message);
  }

  changePassword(){
    let resetDTO: ResetPasswordDTO={ 
      newPassword:this.newPassword,
      newPasswordConfirm:this.confirmPassword,
      code:this.verificationID,
    }
    this.userService.changePassword(this.email, resetDTO).subscribe({
      next: (response) => {
        this.authService.login(this.email, this.newPassword).subscribe(()=>(
          this.userService.getUser().subscribe((user) =>{
            let role = user.authorityDTO.authorityName;
            this.sharedService.currentRole.next(role);
            if(role == "ROLE_USER"){
              this.router.navigate(['userHome']);
            }else if(role == "ROLE_ADMIN"){
              this.router.navigate(['adminHome']);
            }
          }) 
        ));
      },
      error: (error) => {
        console.log(error);
        this.handleError(error);
      }
    });
  }

}
