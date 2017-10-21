import { Component, OnInit } from '@angular/core';
import { AuthService } from './../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  pwd: string;
  emailNew: string;
  pwdNew: string;


  constructor(private authService: AuthService) { }

  ngOnInit() {
    //add this to automatically login
    this.authService.emailLogin("a@a.de", "123456");
  }

  loginEmail() {
    this.authService.emailLogin(this.email, this.pwd);
  }

  signupEmail() {
    this.authService.emailSignup(this.emailNew, this.pwdNew);
  }

  loginGoogle() {
    this.authService.googleLogin();
  }

}
