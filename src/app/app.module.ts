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
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressBarModule
  } from '@angular/material';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './game/overview/overview.component';
import { PvpComponent } from './game/pvp/pvp.component';
import { MissionComponent } from './game/mission/mission.component';
import { GameComponent } from './game/game.component';
import { DungeonComponent } from './game/dungeon/dungeon.component';
import { StatsComponent } from './game/stats/stats.component';
import { ShopComponent } from './game/shop/shop.component';

//Services
import { AuthService } from './core/services/auth.service';
import { PlayerService } from './core/services/player.service';
import { MissionService } from './core/services/mission.service';
import { ClassService } from './core/services/class.service';
import { DungeonService } from './core/services/dungeon.service';
import { WeaponService } from './core/services/weapon.service';
import { ClothesService } from './core/services/clothes.service';

//Pipes
import { FirstUpperCasePipe } from './core/pipes/first-upper-case.pipe';
import { SilverGoldStringPipe } from './core/pipes/silver-gold-string.pipe';



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
        { path: 'stats', component: StatsComponent },
        { path: 'dungeon', component: DungeonComponent },
        { path: 'shop', component: ShopComponent }
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
    DungeonComponent,
    FirstUpperCasePipe,
    StatsComponent,
    SilverGoldStringPipe,
    ShopComponent
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
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule
  ],
  providers: [
    AuthService, 
    PlayerService, 
    MissionService, 
    ClassService,
    DungeonService,
    ClothesService,
    WeaponService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
