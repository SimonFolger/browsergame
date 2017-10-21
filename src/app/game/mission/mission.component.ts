import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../../core/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/player.service';
import { Player } from './../../core/player';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { Mission } from './../../core/mission';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { MissionService } from './../../core/mission.service'


@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})


export class MissionComponent implements OnInit {

  player: Observable<Player>;
  
    players: Observable<Player[]>;

  
    email: string;
    heroName: string = "";
    heroClass: string = "";
    created: boolean = true;
    timer = 0;
    private tick: any;
    private subscription: any;
    gold: number;
    silver: number;
    goldq: number;
    silverq: number;
    gewinn: boolean = false;
    missions: Observable<Mission[]>;

    allMissions: Mission[];
    missionIds: number[] = [];
    
    constructor(
      private authService: AuthService, 
      private playerService: PlayerService, 
      private missionService: MissionService
    ) { } 
  
    ngOnInit() {
      if(this.authService.authState) {
        this.email = this.authService.currentUser['email'];
        this.getPlayer();
        this.getMissions();
        
        this.missions.subscribe(val => {
          this.allMissions = val;
          //console.log(this.allmissions.find(x => x.id === "1"));
          while(this.missionIds.length < 3) {
            let missionLength = this.allMissions.length;
            let random = Math.floor(Math.random() * missionLength);
            if (!this.missionIds.includes(random)) {
              this.missionIds.push(random);
            }
          }
          console.log(this.missionIds.includes(2));
          
        })
      } else {
        this.logout();
      }
    }
   
    getPlayer() {
      this.player = this.playerService.getPlayer(this.email);
      this.player.subscribe(val => {
        //val is null if empty
        console.log(val);
        if (val != null) {
          this.gold = val.gold;
          this.silver = val.silver;
          this.created = true;
          console.log(this.created);
        } else if ( val == null) {
          this.created = false;
        }
      })
    }

    getMissions() {
      this.missions = this.missionService.getMissions();
    }

  
    date = new Date().getTime();
  
  
    add() {
      console.log(this.date);
      this.playerService.add(this.email, this.heroName, this.heroClass, this.date);
    }

    update() {
      this.playerService.update(this.email, this.heroName, this.heroClass, this.date, this.gold, this.silver);
    }
  
    logout() {
      this.authService.signOut();
    }
  


// Funktionen QUESTS

ticks () {
  let timer = TimerObservable.create(2000, 1000);
  this.subscription = timer.subscribe(t => {
    this.tick = t;
    if (this.tick == 30) {
      this.subscription.unsubscribe();
      this.gold = this.gold + this.goldq;
      this.silver = this.silver + this.silverq;
      this.update();       
     }
  });
}

ticks2 () {
  let timer = TimerObservable.create(2000, 1000);
  this.subscription = timer.subscribe(t => {
    this.tick = t;
    if (this.tick == 60) {
      this.subscription.unsubscribe();
      this.gold = this.gold + this.goldq;
      this.silver = this.silver + this.silverq;
      this.update();  
      this.gewinn = true;   
     }
  });
}

}