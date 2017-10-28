import { Component, OnInit } from '@angular/core';
import { AuthService } from './../core/auth.service';
import { PvpService } from './../core/pvp.service';
import { HeroClass } from './../core/hero-class';
import { Player } from './../core/player';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  newPlayer: Player = {
    name: '', 
    email: '',
    class: '',
    exp: 0,
    last: null,
    gold: null,
    silver: null,
    offlinedata: null
  }

  rFormLogin: FormGroup;
  rFormRegister: FormGroup;
  email: string = "";
  pwd: string = "";
  emailNew: string = "";
  pwdNew: string = "";
  pwdNewConfirm: string = "";
  heroName: string = "";
  heroClass : string = "";
  classes: Observable<HeroClass[]>;
  chosenClass: string = "choose a class";

  hideLoginPw: boolean = true;

  emailAlert: string = "Email is required and must be valid";
  pwdAlert: string = "Password must be between 6 and 20 letters";
  pwdConfirmAlert: string = "Passwords do not match";
  heroNameAlert: string = "Hero name must be between 3 and 30 letters"
  signUpError: string = "";
  loginError: string = "";

  constructor(
    private authService: AuthService,
    private pvpService: PvpService,
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
    this.authService.emailLogin("simon@test.de", "123456");

    this.classes = this.pvpService.getClasses();
  }

  comparePasswords() {
    return this.pwdNew === this.pwdNewConfirm;
  }

  getIconPath(className: string) {
    return "../../assets/" + className + ".svg";
  }

  selectClass(className: string) {
    if(this.chosenClass == className) {
      this.chosenClass = "Choose a class:"
    } else {
      this.chosenClass = className;
    }
  }

  loginEmail() {
    this.authService.emailLogin(this.email, this.pwd).then;
    //this.loginError = this.authService.loginError;
  }

  signupEmail() {
    this.newPlayer.class = this.chosenClass;
    this.authService.emailSignup(this.newPlayer, this.pwdNew);
    //this.signUpError = this.authService.signUpError;
  }

  /*loginGoogle() {
    this.authService.googleLogin();
  }*/

}
