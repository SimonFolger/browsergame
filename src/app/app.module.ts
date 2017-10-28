//Basics like Angular, Firebase
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { environment } from "./../environments/environment";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  MatGridListModule,
  MatTabsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatListModule,
  MatToolbarModule
  } from '@angular/material';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './game/overview/overview.component';
import { PvpComponent } from './game/pvp/pvp.component';
import { MissionComponent } from './game/mission/mission.component';
import { GameComponent } from './game/game.component';
import { PlunderComponent } from './game/plunder/plunder.component';
import { DungeonComponent } from './game/dungeon/dungeon.component';

//Services
import { AuthService } from './core/services/auth.service';
import { PlayerService } from './core/services/player.service';
import { MissionService } from './core/services/mission.service';
import { LevelService } from './core/services/level.service';
import { PvpService } from './core/services/pvp.service';
import { DungeonService } from './core/services/dungeon.service';

//Pipes
import { FirstUpperCasePipe } from './core/pipes/first-upper-case.pipe';


//Routing
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
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule
  ],
  providers: [
    AuthService, 
    PlayerService, 
    MissionService, 
    PvpService, 
    LevelService, 
    DungeonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
