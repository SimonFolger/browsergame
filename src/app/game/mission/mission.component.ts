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
    tick: number;
    subscription: any;
    gold: number;
    silver: number;
    questreward: boolean = false;
    missions: Observable<Mission[]>;
    textq: boolean = true;
    questgold:number;
    questsilver:number;

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
      this.playerService.add(this.email, this.heroName, this.heroClass, this.date,);
    }

    update() {
      this.playerService.update(this.email, this.heroName, this.heroClass, this.date, this.gold, this.silver);
    }
  
    logout() {
      this.authService.signOut();
    }
  

ticks (id:number) {
  
  let mission = this.allMissions[id];
  let timer = TimerObservable.create(100, 50); // 2000, 1000
  this.subscription = timer.subscribe(t => {
    this.tick = t;
    if (this.tick == mission.timeq) {
      console.log(mission.timeq)
      this.subscription.unsubscribe();
      this.gold = this.gold + mission.goldq;
      this.questgold = mission.goldq;
      this.silver = this.silver + mission.silverq;
      this.questsilver = mission.silverq;
      this.questreward = true;
      this.update();       
     }
  });
}


}