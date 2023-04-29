import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogRegComponent } from './components/log-reg/log-reg.component';
import { FormsModule } from '@angular/forms';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { NavbarComponent } from './components/navbar/navbar.component'; 
import { TokenInterceptor } from './services/token.service';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CertSimpleViewComponent } from './components/cert-simple-view/cert-simple-view.component';
@NgModule({
  declarations: [
    AppComponent,
    LogRegComponent,
    UserHomeComponent,
    AdminHomeComponent,
    NavbarComponent,
    ForgotPasswordComponent,
    CertSimpleViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export const routingComponents = [UserHomeComponent];