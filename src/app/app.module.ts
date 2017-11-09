//Basics like Angular, Firebase
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, Inject } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { environment } from "./../environments/environment";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AccordionModule} from 'primeng/primeng';     //accordion and accordion tab
import {MenuItem} from 'primeng/primeng'; 
import {DragDropModule} from 'primeng/primeng';
import {PickListModule} from 'primeng/primeng';
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
  MatProgressBarModule,
  MatSnackBarModule,
  MatSnackBar,
  MatSnackBarContainer
  } from '@angular/material';
  

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './game/overview/overview.component';
import { PvpComponent } from './game/pvp/pvp.component';
import { MissionComponent } from './game/mission/mission.component';
import { GameComponent } from './game/game.component';
import { DungeonComponent } from './game/dungeon/dungeon.component';
import { ShopComponent } from './game/shop/shop.component';
import { RankingComponent } from './game/ranking/ranking.component';

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
import { ObjectToArrayPipe } from './core/pipes/object-to-array.pipe';




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
        { path: 'dungeon', component: DungeonComponent },
        { path: 'ranking', component: RankingComponent },
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
    SilverGoldStringPipe,
    ShopComponent,
    ObjectToArrayPipe,
    RankingComponent
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
    MatProgressBarModule, 
    MatSnackBarModule
  ],
  providers: [
    AuthService, 
    PlayerService, 
    MissionService, 
    ClassService,
    DungeonService,
    ClothesService,
    WeaponService,  
    MatSnackBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
