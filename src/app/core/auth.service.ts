import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

@Injectable()
export class AuthService {

  authState: any = null;

  get authenticated(): boolean {
    return this.authState !== null;
  }

  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth, 
    private afs: AngularFirestore, 
    private router: Router
  ) {
    this.user = this.afAuth.authState
        .switchMap(user => {
          if(user) {
            return this.afs.doc<User>('users/${user.uid}').valueChanges();
          } else {
            return Observable.of(null);
          }
        })
  }

  get currentUser(): any {
    return this.authenticated ? this.authState : null;
}

  emailSignup(email: string, password: string, heroName: string, heroClass: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        console.log(heroClass, heroName)
      })
    .catch(error => console.log(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.router.navigate(['/game']);
      })
    .catch(error => console.log(error));
  }


  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
        .then((credential) => {
          this.updateUserData(credential.user);
          this.router.navigate(['/overview']);
        })
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }
    return userRef.set(data)
  }

  
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

}
