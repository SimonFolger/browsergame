import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import * as firebase from 'firebase/app';
import {environment} from "./../environments/environment";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './game/overview/overview.component';
import { AuthService } from './core/auth.service';
import { PlayerService } from './core/player.service';
import { PvpComponent } from './game/pvp/pvp.component';
import { MissionComponent } from './game/mission/mission.component';
import { MissionService } from './core/mission.service';
import { GameComponent } from './game/game.component';
import { RewardService } from './core/reward.service';
import { Reward } from './core/reward';
import {PvpService } from './core/pvp.service';


const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login',  component: LoginComponent },
    { path: 'game',  component: GameComponent,  
      children: [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        { path: 'overview',  component: OverviewComponent },
        { path: 'mission',  component: MissionComponent },
        { path: 'pvp',  component: PvpComponent }
      ] }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    PvpComponent,
    MissionComponent,
    GameComponent
  ],
  imports: [
      BrowserModule,
      RouterModule.forRoot(routes),
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireAuthModule,
      FormsModule,
      ReactiveFormsModule
  ],
  providers: [AuthService, PlayerService, MissionService, RewardService, PvpService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
