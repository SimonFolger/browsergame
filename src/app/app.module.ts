import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule } from '@angular/forms'
import * as firebase from 'firebase/app';
import {environment} from "./../environments/environment";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';
import { AuthService } from './core/auth.service';
import { PlayerService } from './core/player.service';
import { PvpComponent } from './pvp/pvp.component';
import { MissionComponent } from './mission/mission.component';


const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login',  component: LoginComponent },
    { path: 'overview',  component: OverviewComponent },
    { path: 'mission',  component: MissionComponent },
    { path: 'pvp',  component: PvpComponent }

];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    PvpComponent,
    MissionComponent
  ],
  imports: [
      BrowserModule,
      RouterModule.forRoot(routes),
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireAuthModule,
      FormsModule
  ],
  providers: [AuthService, PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
