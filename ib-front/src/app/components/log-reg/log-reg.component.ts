import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserRequest, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-log-reg',
  templateUrl: './log-reg.component.html',
  styleUrls: ['./log-reg.component.css']
})
export class LogRegComponent {
  isSignUp: boolean = false;
  name:string="";
  surname:string="";
  emailReg:string="";
  passwordReg:string="";
  telephoneNumber:string="";
  activating:boolean=false;
  activationId!:string;

  confirmationMethod:string = 'email';
  emailLog!:string;
  passwordLog!:string;


  constructor(private userService:UserService,
     private router: Router,
     private sharedService:SharedService,
     private authService:AuthService
     ){}


  handleError(error: HttpErrorResponse) {
    console.log(error);
    alert("An error occurred: " + error.error.message);
  }
    
  submit(){
    let user:UserRequest = {
      name:this.name,
      surname:this.surname,
      email:this.emailReg,
      password:this.passwordReg,
      telephoneNumber:this.telephoneNumber
    } 
    this.userService.registerUser(user, this.confirmationMethod).subscribe({
      next: (response) => {
        this.activating = true;
      },
      error: (error) => {
        console.error(error);
        this.handleError(error);
      }
  });

  } 

  toggleSignUp(value: boolean): void {
    this.isSignUp = value;
  }


  submitActivation(){
    this.userService.activateUser(this.activationId).subscribe({
      next: (response) => {
        this.sharedService.currentRole.next('USER');
        console.log(response);
        this.authService.login(this.emailReg, this.passwordReg).subscribe({
          next: ()=>{
            this.router.navigate(['userHome']);
          }
        });
    
      },
      error: (error) => {
        console.log(error);
        this.handleError(error);
      }
    });
  }


  
  login() {
    this.authService.login(this.emailLog, this.passwordLog).subscribe(()=>(
      this.userService.getUser().subscribe((user) =>{
        let role = user.authorityDTO.authorityName;
        this.sharedService.currentRole.next(role);
        if(role == "ROLE_USER"){
          this.router.navigate(['userHome']);
        }else if(role == "ROLE_ADMIN"){
         this.router.navigate(['adminHome']);
        }
      }) 
    ),
    (error) => {
      this.handleError(error);
    }
    );  

  }
}
