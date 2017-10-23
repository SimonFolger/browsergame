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
import { MissionService } from './../../core/mission.service';
import { Reward } from './../../core/reward';
import { GameComponent } from './../game.component';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})


export class MissionComponent implements OnInit {

  player: Observable<Player>;
  missions: Observable<Mission[]>;
  randomMissions: Mission[] = [];
  countdown: any;
  zähler: number;
  gold: number;
  silver: number;
  questSuccessful: boolean = false;
  email: string;
  heroName: string = "";
  heroClass: string = "";
  finishTime: number;
  goldReward: number;
  silverReward: number;
 
  constructor(
    private playerService: PlayerService, 
    private missionService: MissionService,
    private gameComponent: GameComponent,
  ) { } 

  //Funktionen die beim Seitenaufruf gestartet werden
  ngOnInit() {
    this.gameComponent.player;
    this.getMissions();
    this.compareOutstandingMissions();
    this.missions.subscribe(val => {
      let allMissions = val;
      let missionLength = allMissions.length;
      while(this.randomMissions.length < 3) {
        let random = Math.floor(Math.random() * missionLength);
        if (!this.randomMissions.includes(allMissions[random])) {
         this.randomMissions.push(allMissions[random]);
        }
      }    
    })
  } 
  
  //Lädt alle Missionen aus der Datenbank
  getMissions() {
    this.missions = this.missionService.getMissions();
  }

  //Holt sich die aktuelle Uhrzeit in Millisekunden
  getCurrentTime() {
    return new Date().getTime();
  }

  //Wenn Mission gestartet wird <Button> 1. Speichere bei Click Questdaten in DB 2, Führe aus wenn Zähler = Missionszeit
  missionStart (missionId: number) {
    let mission = this.randomMissions[missionId];
    let currentTime = this.getCurrentTime();
    this.saveQuestData(currentTime + mission.timeq * 1000, mission.goldq, mission.silverq);
    let timer = TimerObservable.create(2000, 1000); // 2000, 1000
    this.countdown = timer.subscribe(t => {
      this.zähler = t;
      if (this.zähler == mission.timeq) {
       this.countdown.unsubscribe();
       this.gold = this.gold + mission.goldq;
       this.silver = this.silver + mission.silverq;
       this.questSuccessful = true;
       this.update(); 
      }
    })
  }

  //Speichere QuestDaten in Datenbank
  saveQuestData(finishedQuestTime:number, missionsGold:number, missionsSilver:number) {
    this.finishTime = finishedQuestTime;
    this.goldReward = missionsGold;
    this.silverReward = missionsSilver;
    let playerObject:Player = {
      name:this.heroName, 
      email:this.email,
      class:this.heroClass,
      last:this.getCurrentTime(),
      gold:this.gold,
      silver:this.silver,
      stats: null,
      offlinedata:{
        questrewardgold:missionsGold,
        questrewardsilver:missionsSilver,
        finishedquest:finishedQuestTime
      }
    }
    this.playerService.offlinereward(playerObject);

  }

  //Update aktuelle Spielerdaten in Datenbank
  update() {
    let playerObject:Player = {
      name:this.heroName, 
      email:this.email,
      class:this.heroClass,
      last:this.getCurrentTime(),
      gold:this.gold,
      silver:this.silver,
      offlinedata:null,
      stats: null
    }
    this.playerService.update(playerObject);
  }

  //Vergleiche in Datenbank ob Missionen während der Offlinezeit abgeschlossen worden sind.
  compareOutstandingMissions() {
    if (this.getCurrentTime() >= this.finishTime)   {
      let playerObject:Player = {
        name:this.heroName, 
        email:this.email,
        class:this.heroClass,
        last:this.getCurrentTime(),
        stats: null,
        gold:this.gold + this.goldReward,
        silver:this.silver + this.silverReward,
        offlinedata:{
          questrewardgold:this.goldReward,
          questrewardsilver:this.silverReward,
          finishedquest:this.finishTime
        }
      } 
      this.playerService.update(playerObject);
    } 
  }

}


