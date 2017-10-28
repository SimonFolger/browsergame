import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material';
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
import { Reward } from './core/reward';
import {PvpService } from './core/pvp.service';
import { PlunderComponent } from './game/plunder/plunder.component';
import { DungeonComponent } from './game/dungeon/dungeon.component';
import {MatGridListModule} from '@angular/material';
import {MatTabsModule} from '@angular/material';
import {MatCardModule} from '@angular/material';
import {MatFormFieldModule, MatInputModule } from '@angular/material';
import {MatIconModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import { FirstUpperCasePipe } from './core/pipes/first-upper-case.pipe';
import {MatProgressSpinnerModule} from '@angular/material';
import { LevelService } from './core/level.service';
import { Level } from './core/level';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login',  component: LoginComponent },
    { path: 'game',  component: GameComponent,  
      children: [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        { path: 'overview',  component: OverviewComponent },
        { path: 'mission',  component: MissionComponent },
        { path: 'pvp',  component: PvpComponent },
        { path: 'plunder', component: PlunderComponent },
        { path: 'dungeon', component: DungeonComponent }
      ] }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    PvpComponent,
    MissionComponent,
    GameComponent,
    PlunderComponent,
    DungeonComponent,
    FirstUpperCasePipe
  ],
  imports: [
      BrowserModule,
      BrowserAnimationsModule,
      MatCheckboxModule,
      RouterModule.forRoot(routes),
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireAuthModule,
      FormsModule,
      ReactiveFormsModule,
      MatGridListModule,
      MatTabsModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      MatProgressSpinnerModule
  ],
  providers: [AuthService, PlayerService, MissionService, PvpService, LevelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
