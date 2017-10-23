import { Component, OnInit } from '@angular/core';
import { AuthService } from './../core/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  rFormLogin: FormGroup;
  rFormRegister: FormGroup;
  email: string = "";
  pwd: string = "";
  emailNew: string = "";
  pwdNew: string = "";
  pwdNewConfirm: string = "";
  heroName: string = "";
  heroClass : string = "";
  loginMode: boolean = true;
  emailAlert: string = "Email is required and must be valid";
  pwdAlert: string = "Password must be between 6 and 20 letters";
  pwdConfirmAlert: string = "Passwords do not match";
  heroNameAlert: string = "Hero name must be between 3 and 30 letters"

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { 
    this.rFormLogin = fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'pwd': [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])]
    });
    this.rFormRegister = fb.group({
      'emailNew': [null, Validators.compose([Validators.required, Validators.email])],
      'pwdNew': [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      'pwdNewConfirm': [null, Validators.required],
      'heroName': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])]
    });
  }

  ngOnInit() {
    //add this to automatically login
    this.authService.emailLogin("a@a.de", "123456");
  }

  setLoginMode() {
    this.loginMode = true;
  }

  setRegisterMode() {
    this.loginMode = false;
  }

  comparePasswords() {
    console.log(this.pwdNew === this.pwdNewConfirm);
    return this.pwdNew === this.pwdNewConfirm;
  }

  loginEmail() {
    this.authService.emailLogin(this.email, this.pwd);
  }

  signupEmail() {
    this.authService.emailSignup(this.emailNew, this.pwdNew, this.heroName, this.heroClass);
    //Todo: redirect to login and show success/error message
  }

  loginGoogle() {
    this.authService.googleLogin();
  }

}
